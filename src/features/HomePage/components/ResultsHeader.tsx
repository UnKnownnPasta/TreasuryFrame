interface ResultsHeaderProps {
  resultCount: [number, number];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReset: () => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  resultCount, 
  currentPage, 
  totalPages,
  onPageChange,
  onReset
}) => {
  return (
    <div
      id="resultsHeader"
      style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
    >
      <span style={{ marginRight: '1rem', alignSelf: 'center' }}>Results</span>
      <div className="results-navigation">
        <button 
          className="nav-button" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page <span>{currentPage}</span> of <span>{totalPages}</span>
        </span>
        <button 
          className="nav-button" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <div className="results-count">
        <div>
          Showing <span>{resultCount[0]}</span> of <span>{resultCount[1]}</span>
        </div>
        <button className="reset-button" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};
