import React, { useState, useMemo } from 'react';
import './index.scss';
import 'rsuite/dist/rsuite.css';

// reference: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
// reference: https://codesandbox.io/embed/table-sorting-example-ur2z9?fontsize=14&hidenavigation=1&theme=dark

/**
 * object for list of glossaries
 * it can sort the list and cache sorted list so it won't take time for sorting
 */
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const GlossaryTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.words);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort('term')}
              className={getClassNamesFor('term')}
            >
              TERM
            </button>
          </th>
          <th>LINK</th>
          <th>DESCRIPTION</th>
          <th>SOURSE</th>
          <th>DOMAIN</th>
        </tr>
      </thead>
      <tbody>
        {items.map((term) => (
          <tr key={term.id}>
            <td>{term.term}</td>
            <td>{term.link}</td>
            <td>{term.description}</td>
            <td>{term.source}</td>
            <td>{term.domain}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GlossaryTable;
