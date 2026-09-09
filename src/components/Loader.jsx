import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full min-h-[300px]">
      <div className="loader">
        <div className="loader-container">
          <div className="loader-carousel">
            <div className="love"></div>
            <div className="love"></div>
            <div className="love"></div>
            <div className="love"></div>
            <div className="love"></div>
            <div className="love"></div>
            <div className="love"></div>
          </div>
        </div>
        <div className="loader-container">
          <div className="loader-carousel">
            <div className="death"></div>
            <div className="death"></div>
            <div className="death"></div>
            <div className="death"></div>
            <div className="death"></div>
            <div className="death"></div>
            <div className="death"></div>
          </div>
        </div>
        <div className="loader-container">
          <div className="loader-carousel">
            <div className="robots"></div>
            <div className="robots"></div>
            <div className="robots"></div>
            <div className="robots"></div>
            <div className="robots"></div>
            <div className="robots"></div>
            <div className="robots"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
