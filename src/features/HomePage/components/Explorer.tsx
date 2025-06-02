import { useEffect, useRef, useState } from "react";
import "./styles/explorer.css";
import { Filters } from "./Filters";
import { ResultsHeader } from "./ResultsHeader";
import { Inventory } from "./Inventory";
import { useBackgroundTranslatedRelics, useBackgroundTranslatedPrimes } from '../../../screens/background/hooks';

export const Explorer: React.FC = () => {
	const railRef = useRef<HTMLDivElement>(null);
	const explorerTitleRef = useRef<HTMLDivElement>(null);
	const resultsTitleRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const dotExplorerRef = useRef<HTMLDivElement>(null);
	const dotResultsRef = useRef<HTMLDivElement>(null);
	const lineExplorerResultsRef = useRef<HTMLDivElement>(null);
	const lineResultsFooterRef = useRef<HTMLDivElement>(null);
	const dotFooterRef = useRef<HTMLDivElement>(null);
	const translatedRelics = useBackgroundTranslatedRelics();
	const translatedPrimes = useBackgroundTranslatedPrimes();
	const initialData = {
		relics: translatedRelics,
		primes: translatedPrimes
	};

	const [typeFilter, setTypeFilter] = useState<"all" | "relics" | "primes">(
		"all"
	);
	const [vaultedFilter, setVaultedFilter] = useState<"all" | "true" | "false">(
		"all"
	);
	const [nameSearch, setNameSearch] = useState("");
	const [x2Filter, setX2Filter] = useState<"all" | "true" | "false">("all");
	const [tokenFilter, setTokenFilter] = useState<number | null>(null);

	const [edMinFilter, setEdMinFilter] = useState<number | null>(null);
	const [redMinFilter, setRedMinFilter] = useState<number | null>(null);
	const [orangeMinFilter, setOrangeMinFilter] = useState<number | null>(null);
	const [yellowMinFilter, setYellowMinFilter] = useState<number | null>(null);
	const [greenMinFilter, setGreenMinFilter] = useState<number | null>(null);

	const [selectedRarities, setSelectedRarities] = useState<Record<string, Set<string | number>>>({
		ed: new Set(),
		red: new Set(),
		orange: new Set(),
		yellow: new Set(),
		green: new Set(),
	});

	const [resultData, setResultData] = useState<[number, number]>([0, 0]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleReset = () => {
		setTypeFilter("all");
		setVaultedFilter("all");
		setNameSearch("");
		setX2Filter("all");
		setTokenFilter(0);
		setEdMinFilter(0);
		setRedMinFilter(0);
		setOrangeMinFilter(0);
		setYellowMinFilter(0);
		setGreenMinFilter(0);
		setSelectedRarities({
			ed: new Set(),
			red: new Set(),
			orange: new Set(),
			yellow: new Set(),
			green: new Set(),
		});
		setCurrentPage(1);
		setResultData([initialData.relics.length + initialData.primes.length, initialData.relics.length + initialData.primes.length]);
	};

	useEffect(() => {
		const updatePositions = () => {
			if (
				railRef.current &&
				explorerTitleRef.current &&
				resultsTitleRef.current &&
				dotExplorerRef.current &&
				dotResultsRef.current &&
				lineExplorerResultsRef.current &&
				lineResultsFooterRef.current &&
				footerRef.current &&
				dotFooterRef.current
			) {
				const railRect = railRef.current.getBoundingClientRect();
				const explorerRect = explorerTitleRef.current.getBoundingClientRect();
				const resultsRect = resultsTitleRef.current.getBoundingClientRect();
				const footerRect = footerRef.current.getBoundingClientRect();

				const explorerCenter = explorerRect.top + explorerRect.height / 2 - railRect.top;
				const resultsCenter = resultsRect.top + resultsRect.height / 2 - railRect.top;

				dotExplorerRef.current.style.top = `${explorerCenter - 13}px`;
				dotResultsRef.current.style.top = `${resultsCenter - 13}px`;

				lineExplorerResultsRef.current.style.top = `${explorerCenter + 10}px`;
				lineExplorerResultsRef.current.style.height = `${resultsCenter - explorerCenter - 18}px`;

				const dotBottom = resultsCenter + 9;
				const footerTop = footerRect.top - railRect.top;
				const lineHeight = Math.max(0, footerTop - dotBottom);

				lineResultsFooterRef.current.style.top = `${dotBottom}px`;
				lineResultsFooterRef.current.style.height = `${lineHeight - 20}px`;
				dotFooterRef.current.style.top = `${lineHeight + dotBottom - 30}px`;
			}
		};

		updatePositions();
		window.addEventListener('resize', updatePositions);
		return () => window.removeEventListener('resize', updatePositions);
	}, []);

	const totalPages = Math.max(1, Math.ceil(resultData[1] / itemsPerPage));

	return (
		<div className="ae-explorer-body">
			<div className="ae-timeline-main">

				<div className="ae-timeline-rail js-timeline-rail" ref={railRef}>
					<div className="ae-timeline-dot dot-explorer" ref={dotExplorerRef} />
					<div className="ae-timeline-line line-explorer-results" ref={lineExplorerResultsRef} />
					<div className="ae-timeline-dot dot-results" ref={dotResultsRef} />
					<div className="ae-timeline-line line-results-footer" ref={lineResultsFooterRef} />
					<div className="ae-timeline-dot dot-footer" ref={dotFooterRef} />
				</div>

				<div className="ae-timeline-content" style={{ paddingRight: "12px" }}>
					<section className="ae-timeline-section section-explorer">
						<div className="ae-timeline-title-row" ref={explorerTitleRef}>Inventory Explorer</div>
						<Filters
							setTypeFilter={setTypeFilter}
							setVaultedFilter={setVaultedFilter}
							setNameSearch={setNameSearch}
							setX2Filter={setX2Filter}
							setTokenFilter={setTokenFilter}
							setEdMinFilter={setEdMinFilter}
							setRedMinFilter={setRedMinFilter}
							setOrangeMinFilter={setOrangeMinFilter}
							setYellowMinFilter={setYellowMinFilter}
							setGreenMinFilter={setGreenMinFilter}
							setSelectedRarities={setSelectedRarities}
							typeFilter={typeFilter}
							vaultedFilter={vaultedFilter}
							nameSearch={nameSearch}
							x2Filter={x2Filter}
							tokenFilter={tokenFilter}
							edMinFilter={edMinFilter}
							redMinFilter={redMinFilter}
							orangeMinFilter={orangeMinFilter}
							yellowMinFilter={yellowMinFilter}
							greenMinFilter={greenMinFilter}
							selectedRarities={selectedRarities}
						/>
					</section>
					<section className="ae-timeline-section section-results">
						<div className="ae-timeline-title-row" style={{alignItems: "flex-start"}} ref={resultsTitleRef}>
							<ResultsHeader 
								resultCount={resultData}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								onReset={handleReset}
							/>
						</div>
						<div className="ae-inventory-area">
							<Inventory 
								typeFilter={typeFilter}
								vaultedFilter={vaultedFilter}
								nameSearch={nameSearch}
								x2Filter={x2Filter}
								tokenFilter={tokenFilter}
								edMinFilter={edMinFilter}
								redMinFilter={redMinFilter}
								orangeMinFilter={orangeMinFilter}
								yellowMinFilter={yellowMinFilter}
								greenMinFilter={greenMinFilter}
								selectedRarities={selectedRarities}
								setResultCount={setResultData}
								currentPage={currentPage}
								onPageChange={handlePageChange}
							/>
						</div>
					</section>
				</div>
			</div>

			<footer className="ae-footer" ref={footerRef} />
		</div>
	);
};
