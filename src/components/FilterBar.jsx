import { categories } from "../utils";

function FilterBar({ search, setSearch, filter, setFilter }) {
  // filter buttons: All, Food, Transport...
  const filterNames = ["All"].concat(categories);
  const filterButtons = [];
  for (let i = 0; i < filterNames.length; i++) {
    const filterName = filterNames[i];

    let buttonClass = "chip";
    if (filter === filterName) {
      buttonClass = "chip active";
    }

    filterButtons.push(
      <button
        key={filterName}
        className={buttonClass}
        onClick={function () {
          setFilter(filterName);
        }}
      >
        {filterName}
      </button>
    );
  }

  return (
    <>
      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search transactions..."
          value={search}
          onChange={function (event) {
            setSearch(event.target.value);
          }}
        />
      </div>

      <div className="filters">{filterButtons}</div>
    </>
  );
}

export default FilterBar;