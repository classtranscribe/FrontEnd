import React, { useState, useMemo, useEffect } from 'react';
import './index.scss';
import "rsuite/dist/rsuite.css";
import { cthttp } from 'utils/cthttp/request';
import { prompt } from 'utils';
import GlossaryEditForm from '../GlossaryEditForm';
import GlossaryAddForm from '../GlossaryAddForm';

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
    let {
      words,
      offeringId,
      courseId
    } = props;

    const ONE_PAGE_NUM = 50 // one page will have at most 50 glossaries
    const { items, requestSort, sortConfig } = useSortableData(words);
    const [pageNumber, setPageNumber] = useState(1); // the page number is at first 1
    const [jumpNumber, setJumpNumber] = useState(1);
    const [length, setLength] = useState(0); // the length of filtered items is set to 0
    const [search, setSearch] = useState(''); // search text is at first empty
    const [onePage, setOnePage] = useState([]);
    const [isExplanation, setIsExplanation] = useState(new Array(ONE_PAGE_NUM).fill(false));
    const [edit, setEdit] = useState(false); // show the edit form if true
    const [editI, setEditI] = useState(0);
    const [add, setAdd] = useState(false); // show the add form if true

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
      setIsExplanation(new Array(ONE_PAGE_NUM).fill(false));
    }, [items])

    const getClassNamesFor = name => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const handleJump = () => {
      if (jumpNumber >= 1 && (jumpNumber-1)*ONE_PAGE_NUM < length) {
        // pagenumber is valid
        setPageNumber(jumpNumber);
      } else {
        alert("please enter a valid page number!");
      }
    }

    const handlePrevPage = () => {
      let newPage = Math.ceil(pageNumber-1);
      if (newPage < 1) {
        setPageNumber(1);
      } else {
        setPageNumber(newPage);
      }
    }

    const handleNextPage = () => {
      let newPage = Math.ceil(pageNumber+1);
      if ((newPage-1)*ONE_PAGE_NUM >= length) {
        setPageNumber(Math.ceil(length / ONE_PAGE_NUM));
      } else {
        setPageNumber(newPage);
      }
    }

    // handleSetData, handleDeleteData and handleAddData are used to update items
    const handleSetData = (i, data) => {
      if (i >= 0 && i < items.length) {
        items[i] = data;
        // we reset onepage to refresh the data
        const index = (pageNumber-1) * ONE_PAGE_NUM;
        setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + ONE_PAGE_NUM));
      }
    }

    const handleDeleteData = (i) => {
      if (i >= 0 && i < items.length) {
        items.splice(i, 1);
        // we reset onepage to refresh the data
        const index = (pageNumber-1) * ONE_PAGE_NUM;
        setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + ONE_PAGE_NUM));
      }
    }

    const handleAddData = (data) => {
      items.unshift(data);
      // we reset onepage to refresh the data
      const index = (pageNumber-1) * ONE_PAGE_NUM;
      setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + ONE_PAGE_NUM));
    }

    const handleLike = async(termId) => {
      const res = await cthttp.put(`Glossary/Upvote/${termId}`);
      if (res.status === 200) {
        const res2 = await cthttp.get(`Glossary/${termId}`);
        if (res2.status === 200) {
          // const index = onePage.findIndex((ele) => ele.id === termId);
          const index = items.findIndex((ele) => ele.id === termId);
          handleSetData(index, res2.data);
        }
      }
    }

    const handleMoreLess = (index) => {
      const newArray = [...isExplanation];
      newArray[index] = !newArray[index];
      setIsExplanation(newArray);
    }

    const handleEdit = (i) => {
      setEdit(true);
      setEditI(i);
    }

    const sendEditRequest = async(data) => {
      const res = await cthttp.put(`Glossary/${data.id}`, data);
      if (res.status === 200) {
        prompt.addOne({ text: 'Successfully edit the term!' , timeout: 4000 });
        const index = items.findIndex((ele) => ele.id === data.id);
        handleSetData(index, data);
      } else {
        prompt.addOne({ text: `Edit term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    const sendDeleteRequest = async(id) => {
      const res = await cthttp.delete(`Glossary/${id}`);
      if (res.status === 200) {
        prompt.addOne({ text: 'Successfully delete the term!' , timeout: 4000 });
        const index = items.findIndex((ele) => ele.id === id);
        handleDeleteData(index);
      } else {
        prompt.addOne({ text: `Delete term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    const sendAddRequest = async(data) => {
      const res = await cthttp.post(`Glossary`, data);
      if (res.status === 201) {
        prompt.addOne({ text: 'Successfully add the term!' , timeout: 4000 });
        handleAddData(res.data);
      } else {
        prompt.addOne({ text: `Add term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    return (
      <div>
        <div className='tableBar'>
          <input 
            className='searchBox'
            type='text'
            placeholder='Search for Glossaries' 
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='pageNumber'>Page: {(`${pageNumber}/${Math.ceil(length / ONE_PAGE_NUM)}`)}</span>
          <button onClick={handlePrevPage} disabled={(pageNumber <= 1)}>Prev</button>
          <button onClick={handleNextPage} disabled={(pageNumber*ONE_PAGE_NUM >= length)}>Next</button>
          <input className='pageBox' type='text' onChange={(e) => setJumpNumber(e.target.value)} />
          <button onClick={handleJump}>Go</button>
          <button onClick={() => setAdd(true)} disabled={offeringId==='' || courseId===''}>AddGlossary</button>
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
              <th>DEFINITION</th>
              <th>SOURSE</th>
              {/* <th>
                <button
                  type="button"
                  onClick={() => requestSort("domain")}
                  className={getClassNamesFor("domain")}
                >
                  DOMAIN
                </button>
              </th> */}
              <th>LIKE</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {onePage.map((term, i) => {
              return (
                <tr key={term.id}>
                  <td>{term.term}</td>
                  <td>
                    <a target="_blank" rel="noopener noreferrer" href={term.link}>{term.link}</a>
                  </td>
                  <td>
                    {(isExplanation[i]===true && term.explanation !== null) ? term.explanation : term.description}
                    {term.explanation !== null && 
                      <button 
                        type="button" 
                        onClick={() => handleMoreLess(i)}
                      > 
                        {isExplanation[i]===true ? ("less") : ("more")} 
                      </button>}
                  </td>
                  <td>{term.source}</td>
                  {/* <td>{term.domain}</td> */}
                  <td>{term.likes}</td>
                  <td><button onClick={() => handleLike(term.id)}>like</button></td>
                  <td><button onClick={() => handleEdit(i)}>edit</button></td>
                </tr>
              );
            })}
          </tbody>
          {edit && 
            <GlossaryEditForm 
              datadic={onePage[editI]}
              setEdit={setEdit} 
              sendEdit={sendEditRequest}
              sendDelete={sendDeleteRequest}
            />}
          {add && 
            <GlossaryAddForm 
              setEdit={setAdd} 
              sendAdd={sendAddRequest}
              offeringId={offeringId}
              courseId={courseId}
            />}
        </table>
      </div>
    );
}

export default GlossaryTable;