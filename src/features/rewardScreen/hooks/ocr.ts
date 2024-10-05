import { createWorker } from "tesseract.js";
import { log } from "../../../lib/log";
import * as fuzzySearch from "@m31coding/fuzzy-search";

interface boxType {
    x: number;
    y: number;
    width: number;
    height: number;
}

function predictBoxBounds(boxes: boxType[], imageWidth: number): boxType[] {
    const newBoxes = [];

    boxes.sort((a, b) => a.x - b.x);

    function boxExists(x: number, y: number, width: number, height: number) {
        return boxes.some(
            (box) =>
                Math.abs(box.x - x) < 3 &&
                Math.abs(box.y - y) < 3 &&
                Math.abs(box.width - width) < 3 &&
                Math.abs(box.height - height) < 3
        );
    }

    for (let i = 0; i < boxes.length; i++) {
        const rect = boxes[i];
        newBoxes.push(rect);

        // Predict box to the right
        const rightX = rect.x + rect.width;
        const rightXTwo = rect.x + 2 * rect.width;
        if (rightX + rect.width <= imageWidth && !boxExists(rightX, rect.y, rect.width, rect.height)) {
            newBoxes.push({
                x: rightX,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            });
        }
        if (rightXTwo + rect.width <= imageWidth && !boxExists(rightXTwo, rect.y, rect.width, rect.height)) {
            newBoxes.push({
                x: rightXTwo,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            });
        }

        // Predict box to the left
        const leftX = rect.x - rect.width;
        const leftXTwo = rect.x - 2 * rect.width;
        if (leftX >= 0 && !boxExists(leftX, rect.y, rect.width, rect.height)) {
            newBoxes.push({
                x: leftX,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            });
        }
        if (leftXTwo >= 0 && !boxExists(leftXTwo, rect.y, rect.width, rect.height)) {
            newBoxes.push({
                x: leftXTwo,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            });
        }
    }

    return newBoxes;
}

export function detectEdgesAndGetBoxes(imageSrcId: HTMLCanvasElement) {
    let src = cv.imread(imageSrcId);
    let gray = new cv.Mat();
    let blurred = new cv.Mat();
    let binary = new cv.Mat();
    let dst = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY, 0);
    // Apply gaussian blur
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    // Apply binary thresholding to enhance square-like structures
    cv.threshold(blurred, binary, 120, 255, cv.THRESH_BINARY);
    // Detect edges using Canny edge detection
    cv.Canny(src, dst, 20, 60, 3, true);
    // Find contours from the edge-detected image
    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const minSize = 120;
    const aspectRatioTolerance = 0.5;
    let setBoxes = [];

    // @ts-ignore
    for (let i = 0; i < contours.size(); i++) {
        let rect = cv.boundingRect(contours.get(i));
        let aspectRatio = rect.width / rect.height;

        // Check if aspect ratio is close to 1 and if the square is large enough
        if (
            Math.abs(aspectRatio - 1) <= aspectRatioTolerance &&
            rect.width > minSize &&
            rect.height > minSize
        ) {
            setBoxes.push(rect);
        }
    }

    const newBoxes = predictBoxBounds(setBoxes, 1366);
    const boxes = [];

    const shiftValueUno = 125;
    const shiftValueDos = 123;

    for (const oldRect of newBoxes) {
        const { x, y, width, height } = oldRect;

        // First Shift
        const newY = y + shiftValueUno;
        const newHeight = height - shiftValueUno;

        if (newHeight > 0) {
            const rect = { x, y: newY, width, height: newHeight };
            boxes.push(rect);
        }

        // Second Shift
        const newY2 = y + shiftValueDos;
        const newHeight2 = height - shiftValueDos;
        
        if (newHeight2 > 0) {
            const newRect = { x, y: newY2, width, height: newHeight2 };
            boxes.push(newRect);
        }
    }

    // Clean up
    src.delete();
    gray.delete();
    blurred.delete();
    binary.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();

    return boxes;
}

export async function ocr(PATH: string) {
    log("OCR", "src/features/rewardScreen/hooks/ocr.ts", `Path: ${PATH}`);

    const worker = await createWorker("eng");
    await worker.setParameters({
        tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ &",
    });

    const rectangles: boxType[] = [];
    const image = new Image();
    image.src = PATH;

    await new Promise<void>((resolve, reject) => {
        image.onerror = (ev) => {
            console.log(ev);
            reject(`Error w/img: ${PATH}`);
        };
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);
            
            const boxes = detectEdgesAndGetBoxes(canvas);
            rectangles.push(...boxes);
            resolve();
        };
    });

    const values: string[] = [];
    for (let i = 0; i < rectangles.length; i++) {
        const { x, y, width, height } = rectangles[i];
        const { data: { text } } = await worker.recognize(image.src, {
            rectangle: { left: x, top: y, width, height },
        }).catch((err) => {
            console.log('ERROR', err);
            return { data: { text: "ERROR" } };
        });
        values.push(text);
    }

    await worker.terminate();
    const filePathInFolder = `${PATH.split('/')[-1]?.replace(/\+/gi, " ")}`

    try {
        overwolf.extensions.io.delete(
            // @ts-ignore
            overwolf.extensions.io.enums.StorageSpace.pictures,
            filePathInFolder,
            console.log
        )
    } catch (error) {
        log(`Error deleting ${filePathInFolder}`, "src/features/rewardScreen/hooks/ocr.ts", "ocr")    
    }
    return values;
}

interface PartData {
    item: string;
    stock: string;
}

export function testForPrimeParts(ocrTextData: string, primeStore: PartData[]): string[] {
    const resultArr: string[] = [];
    const ocrText: string = ocrTextData
        .replace(/(prime)/gi, "")
        .toLowerCase()
        .replace(/(forma blueprint)/gi, "")
        .replace(/(error)/gi, "")
        .replace(/(\|\s+\|)/gi, "")
        .replace(/\s+/g, " ");

    log(`Testing ${ocrText}`, "src/features/rewardScreen/hooks/ocr.ts", "testForPrimeParts");

    const searcher = fuzzySearch.SearcherFactory.createDefaultSearcher();
    searcher.indexEntities(
        primeStore,
        // @ts-ignore
        (e) => e.item,
        // @ts-ignore
        (e) => [e.item, e.stock]
    );

    for (const text of ocrText.split(" | ")) {
        const result = searcher.getMatches(new fuzzySearch.Query(text, Infinity, 0.55));

        console.log(`OCRTEXT Testing result:`, result);
        for (const match of result.matches) {
            resultArr.push(`${primeStore.find(p => p.item === match.matchedString)?.stock ?? 0}x|${match.matchedString}`);
        }
    }

    return resultArr ? resultArr : [];
}
