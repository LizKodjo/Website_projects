import type { FC } from "react";

const LoadingSpinner: FC = () => {
  return (
    <>
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </>
  );
};
export default LoadingSpinner;
