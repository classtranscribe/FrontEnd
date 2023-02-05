import React, { useState, useMemo, useEffect } from 'react';
import './index.scss';
import "rsuite/dist/rsuite.css";
// import axios from 'axios';

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
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
  
    const requestSort = key => {
      let direction = "ascending";
      if (sortConfig && 
        sortConfig.key === key && 
        sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
      setSortConfig({ key, direction });
    };
  
    return { items:sortedItems, requestSort, sortConfig};
};



const GlossaryTable = props => {
    const { items, requestSort, sortConfig } = useSortableData(props.words);
    const [pageNumber, setPageNumber] = useState(1); // the page number is at first 1
    const [jumpNumber, setJumpNumber] = useState(1);
    const [length, setLength] = useState(0); // the length of filtered items is set to 0
    const [search, setSearch] = useState(''); // search text is at first empty
    const [onePage, setOnePage] = useState([]);
    const ONE_PAGE_NUM = 50 // one page will have at most 50 glossaries
    // const apiInstance = axios.create({
    //   baseURL: 'https://ct-dev.ncsa.illinois.edu',
    //   timeout: 1000,
    // });

    useEffect(() => {
      const index = (pageNumber-1) * ONE_PAGE_NUM;
      setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + ONE_PAGE_NUM));
    }, [pageNumber]); // we set page after pagenumber changed

    useEffect(() => {
      const filtered = items.filter(item => item.term.toLowerCase().includes(search.toLowerCase()));
      setLength(filtered.length);
      setPageNumber(1);
      setOnePage(filtered.slice(0, 50));
    }, [search])

    useEffect(() => {
      setLength(items.length);
      setSearch('');
      setPageNumber(1);
      setOnePage(items.slice(0, 50));
    }, [items])

    const getClassNamesFor = name => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const handleJump = () => {
      if (jumpNumber >= 1 && jumpNumber*ONE_PAGE_NUM < length) {
        // pagenumber is valid
        setPageNumber(jumpNumber);
      } else {
        alert("please enter a valid page number!");
      }
    }

    const handlePrevPage = () => {
      setPageNumber(pageNumber-1);
    }

    const handleNextPage = () => {
      setPageNumber(pageNumber+1);
    }

    const handleLike = (termId) => {
      alert(`you try to like ${termId}, but api is not deployed!`);
    }

    return (
      <div>
        <div id='tableBar'>
          <input 
            id='searchBox'
            type='text'
            placeholder='Search for Glossaries' 
            onChange={(e) => setSearch(e.target.value)}
          />
          <span id='pageNumber'>Page: {(`${pageNumber}/${Math.ceil(length / ONE_PAGE_NUM)}`)}</span>
          <button onClick={handlePrevPage} disabled={(pageNumber===1)}>Prev</button>
          <button onClick={handleNextPage} disabled={(pageNumber*ONE_PAGE_NUM >= length)}>Next</button>
          <input id='pageBox' type='text' onChange={(e) => setJumpNumber(e.target.value)} />
          <button onClick={handleJump}>Go</button>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>
                <button 
                  type="button" 
                  onClick={() => requestSort("term")}
                  className={getClassNamesFor("term")}
                >
                  TERM
                </button>
              </th>
              <th>LINK</th>
              <th>DESCRIPTION</th>
              <th>SOURSE</th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("domain")}
                  className={getClassNamesFor("domain")}
                >
                  DOMAIN
                </button>
              </th>
              <th>LIKE</th>
              <th>ADDLIKE</th>
            </tr>
          </thead>
          <tbody>
            {onePage.map(term => (
              <tr key={term.id}>
                <td>{term.term}</td>
                <td>{term.link}</td>
                <td>{term.description}</td>
                <td>{term.source}</td>
                <td>{term.domain}</td>
                <td>{term.likes}</td>
                <td><button onClick={() => handleLike(term.id)}>like</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default GlossaryTable;