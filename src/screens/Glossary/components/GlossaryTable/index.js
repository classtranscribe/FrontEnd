import React, { useState, useMemo, useEffect } from 'react';
import './index.scss';
import 'rsuite/dist/rsuite.css';
// import { v1 as uuidv1 } from 'uuid';
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

    const N_ITEMS_PER_PAGE = 50 // one page will have at most 50 glossaries
    const { items, requestSort, sortConfig } = useSortableData(words);
    const [pageNumber, setPageNumber] = useState(1); // the page number is at first 1
    const [length, setLength] = useState(0); // the length of filtered items is set to 0
    const [search, setSearch] = useState(''); // search text is at first empty
    const searchId = 'search-control';
    const searchPlaceholder = 'Search';
    const [onePage, setOnePage] = useState([]);
    const [isExplanation, setIsExplanation] = useState(new Array(N_ITEMS_PER_PAGE).fill(false));
    const [edit, setEdit] = useState(false); // show the edit form if true
    const [editI, setEditI] = useState(0);
    const [add, setAdd] = useState(false); // show the add form if true

    let maxPageNumber = Math.ceil(length / N_ITEMS_PER_PAGE);

    const updateVisibleItems = () => {
      const filtered = items.filter(item => item.term.toLowerCase().includes(search.toLowerCase()));
      setLength(filtered.length);
      // sanity check for page number
      if( pageNumber >1 && pageNumber > Math.ceil(length / N_ITEMS_PER_PAGE)) {
        setPageNumber(1);
      }

      const index = (pageNumber-1) * N_ITEMS_PER_PAGE;
      setOnePage(filtered.slice(index, index + N_ITEMS_PER_PAGE));
    }
    
    useEffect(() => {
      updateVisibleItems();
    }, [pageNumber]); // we set page after pagenumber changed

    useEffect(() => {
      setPageNumber(1);
      updateVisibleItems();
    }, [search])

    useEffect(() => {
      setLength(items.length);
      setSearch('');
      setPageNumber(1);
      updateVisibleItems();
      setIsExplanation(new Array(N_ITEMS_PER_PAGE).fill(false));
    }, [items])

    const getClassNamesFor = name => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    

    const handlePrevPage = () => {
      const newPage = Math.ceil(pageNumber-1);
      setPageNumber(newPage < 1 ? 1 : newPage);
    }

    const handleNextPage = () => {
      const newPage = Math.ceil(pageNumber+1);
      setPageNumber(newPage > maxPageNumber ? maxPageNumber : newPage);
    }

    // handleSetData, handleDeleteData and handleAddData are used to update items
    const handleSetData = (i, data) => {
      if (i >= 0 && i < items.length) {
        items[i] = data;
        // we reset onepage to refresh the data
        const index = (pageNumber-1) * N_ITEMS_PER_PAGE;
        setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + N_ITEMS_PER_PAGE));
      }
    }

    const handleDeleteData = (i) => {
      if (i >= 0 && i < items.length) {
        items.splice(i, 1);
        // we reset onepage to refresh the data
        const index = (pageNumber-1) * N_ITEMS_PER_PAGE;
        setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + N_ITEMS_PER_PAGE));
      }
    }

    const handleAddData = (data) => {
      items.unshift(data);
      // we reset onepage to refresh the data
      const index = (pageNumber-1) * N_ITEMS_PER_PAGE;
      setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + N_ITEMS_PER_PAGE));
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
        prompt.addOne({ text: 'Item updated' , timeout: 4000 });
        const index = items.findIndex((ele) => ele.id === data.id);
        handleSetData(index, data);
      } else {
        prompt.addOne({ text: `Edit term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    const sendDeleteRequest = async(id) => {
      const res = await cthttp.delete(`Glossary/${id}`);
      if (res.status === 200) {
        prompt.addOne({ text: 'Item deleted' , timeout: 4000 });
        const index = items.findIndex((ele) => ele.id === id);
        handleDeleteData(index);
      } else {
        prompt.addOne({ text: `Delete term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    const sendAddRequest = async(data) => {
      const res = await cthttp.post(`Glossary`, data);
      if (res.status === 201) {
        prompt.addOne({ text: 'Item added' , timeout: 4000 });
        handleAddData(res.data);
      } else {
        prompt.addOne({ text: `Add term failed error code:${res.status}` , timeout: 4000 });
      }
    }

    

    return (
      <div>
        <div className='tableBar'>
          {offeringId?(
            <><label htmlFor={searchId} className="sr-only">{searchPlaceholder}</label>
              <input
                id={searchId}
                className='searchBox'
                type='text'
                placeholder={`${searchPlaceholder}...`}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => setAdd(true)} disabled={offeringId+courseId===''}>New</button>
            </>):null}         
          {maxPageNumber<2? null:(
            <><span className='pageLabel'>Page {pageNumber} of {maxPageNumber}</span>
              <button onClick={handlePrevPage} disabled={(pageNumber <= 1)}>Prev</button>
              <button onClick={handleNextPage} disabled={(pageNumber*N_ITEMS_PER_PAGE >= length)}>Next</button>
            </>)}
          
        </div>
        
        <table aria-rowcount={length}>
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
              <th>SOURCE</th>
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
              { /* Not sure why this triggers the input label accessibility role, might be a library bug since it's just a space */}
              { /* eslint-disable jsx-a11y/control-has-associated-label */ }
              <th>&nbsp;</th>
              { /* eslint-enable jsx-a11y/control-has-associated-label */ }
            </tr>
          </thead>
          <tbody>
            {onePage.map((term, i) => {
              return (
                <tr key={term.id} aria-rowindex={1+ i + (pageNumber-1) * N_ITEMS_PER_PAGE}>
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
