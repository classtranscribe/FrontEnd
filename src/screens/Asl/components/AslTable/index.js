/* eslint-disable jsx-a11y/no-static-element-interactions */
/* drawing-wrap div interactivity supports dragging the video dialog around
   and keyboard movement. */
import React, { useState, useMemo, useEffect, useCallback, useRef} from 'react';

import './index.scss';
import 'rsuite/dist/rsuite.css';
import { cthttp } from 'utils/cthttp/request';
import {env} from 'utils/env';
// reference: https://www.smashingmagazine.com/2020/03/sortable-tables-react/
// reference: https://codesandbox.io/embed/table-sorting-example-ur2z9?fontsize=14&hidenavigation=1&theme=dark
// reference: https://segmentfault.com/a/1190000038615186#item-3
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



const AslTable = props => {
    const N_ITEMS_PER_PAGE = 50 // one page will have at most 50 glossaries
    const { items, requestSort, sortConfig } = useSortableData(props.words);
    const [pageNumber, setPageNumber] = useState(1); // the page number starts at 1
    const [jumpNumber, setJumpNumber] = useState(1);
    const [length, setLength] = useState(0); // the length of filtered items is set to 0
    const [search, setSearch] = useState(''); // search text is at first empty
    const searchPlaceholder = 'Search for ASL glossaries';
    const [onePage, setOnePage] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const videoRef = useRef(null);
    const [style, setStyle] = useState({
        left: 100,
        top: 100,
        width: 600,
        height: 400
    });
    

    const [oriPos, setOriPos] = useState({
        // player position
        top: 0,
        left: 0,
        // cursor position
        cX: 0, 
        cY: 0
    })
    const [isDown, setIsDown] = useState(false);
    const [direction, setDirection] = useState('');
    
    useEffect(() => {
      const index = (pageNumber-1) * N_ITEMS_PER_PAGE;
      setOnePage(items.filter(item => item.term.toLowerCase().includes(search.toLowerCase())).slice(index, index + N_ITEMS_PER_PAGE));
    }, [pageNumber]); // we set page after pagenumber changed

    useEffect(() => {
      const filtered = items.filter(item => item.term.toLowerCase().includes(search.toLowerCase()));
      setLength(filtered.length);
      setPageNumber(1);
      setOnePage(filtered.slice(0, N_ITEMS_PER_PAGE));
    }, [search])

    useEffect(() => {
      setLength(items.length);
      setSearch('');
      setPageNumber(1);
      setOnePage(items.slice(0, N_ITEMS_PER_PAGE));
    }, [items])

    const getClassNamesFor = name => {
        if (!sortConfig) {
          return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const handleJump = () => {
      if (jumpNumber >= 1 && jumpNumber*N_ITEMS_PER_PAGE < length) {
        // pagenumber is valid
        setPageNumber(jumpNumber);
      } else {
        // alert("please enter a valid page number!");
      }
    }

    const numberToCate = (num) => {
      if (num === 1) {
        return 'Sign'
      }
      if (num === 2) {
        return 'Definition'
      }
      return 'Example'
    }

    const handleVideo = (term) => {
      setSelectedTerm(term);
      const source = term.source;
      const uniqueASLIdentifier = term.uniqueASLIdentifier;
      const origin = env.baseURL || window.location.hostname;
      if (origin !== '') {
        const src = source.toLowerCase();
        if (src) {
          setVideoUrl(`${origin}/data/aslvideos/${src}/original/${uniqueASLIdentifier}.mp4`);
          setShowVideo(true);
          // if changing to a new video, we need to nudge the video element to load the new source
          if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
            // It is unusual to forcibly set the focus, but
            // as the video represents a dialog, we want to focus on it when it opens
            videoRef.current.focus();
          }
        }
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
      if ((newPage-1)*N_ITEMS_PER_PAGE >= length) {
        setPageNumber(Math.ceil(length / N_ITEMS_PER_PAGE));
      } else {
        setPageNumber(newPage);
      }
    }

    const handleLike = async(termId) => {
      const res = await cthttp.put(`ASLVideo/Upvote/${termId}`);
      if (res.status === 200) {
        const index = onePage.findIndex((ele) => ele.id === termId);
        const newArray = [...onePage];
        
        if (index !== -1) {
          const newTerm = {...newArray[index]};
          newTerm.likes += 1;
          newArray[index] = newTerm;
          setOnePage(newArray);
        }
      }
    }
    
    // execute resize or move
    const transform = (e) => {
      // this will calculate how far mouse moves from original place
      const newstyle = {...oriPos};
      const offsetX = e.clientX - oriPos.cX;
      const offsetY = e.clientY - oriPos.cY;

      // Todo: bound use tbodyRef
      switch (direction) {
          case 'move' :
            newstyle.top = oriPos.top + offsetY;
            newstyle.left = oriPos.left + offsetX;
            break
          case 'resize':
            // avoid size set to negative value
            newstyle.height = Math.max(10, newstyle.height + offsetY);
            newstyle.width = Math.max(10, newstyle.width + offsetX); 
            break
          default:
            break;
      }
      return newstyle;
    }

    // start moving or resize
    const onMouseDown = useCallback((dir, e) => {
        e.stopPropagation();
        setDirection(dir);
        setIsDown(true);
        const cY = e.clientY;
        const cX = e.clientX;
        setOriPos({...style, cX, cY});
    })
    const moveDirections = { "ArrowDown": [0,1], "ArrowUp": [0,-1], "ArrowLeft": [-1,0], "ArrowRight": [1,0] };
    const onKeyDown = useCallback((e) => {
      // eslint-disable-next-line no-alert
      
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowVideo(false);
        return;
      } 
      const delta = moveDirections[e.key];
      if(!delta) return;
      const jump = 40;
      // eslint-disable-next-line no-console
      const newStyle = {...style, 
        left: style.left + delta[0] * jump,
        top: style.top + delta[1] * jump
      };
      setStyle(newStyle);
      e.preventDefault();
    }, [style]);

    // call transform to execute move or resize
    const onMouseMove = useCallback((e) => {
        if (isDown) {
          let newStyle = transform(e);
          setStyle(newStyle);
        }        
    })

    // release mouse
    const onMouseUp = useCallback(() => {
      setIsDown(false);
    }, [])

    const onMouseLeave = useCallback(() => {
      setIsDown(false);
    }, [])
/* drawing-wrap is a wrapping div that supports dragging the video dialog around using the mouse, and
   moving it using cursor keys. Escape key or the "X" button can close it.
   Todo: investigate React Draggable; maybe there's a better way to support this.
    */

    return (
      <div>
        {showVideo && (
        <div 
          className="drawing-wrap"
          onMouseDown={onMouseDown.bind(this, 'move')} 
          onMouseUp={onMouseUp} 
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
          aria-modal
          aria-roledescription='dialog'
        > 
          <div className="drawing-item" style={style}>
            <button 
              id='close-button'
              aria-label="Close Video Popup"
              onClick={() => setShowVideo(false)}
            ><span aria-hidden="true">X</span>
            </button>
            <span>{`${selectedTerm.term} (Source:${selectedTerm.source})`}</span>
            <video 
              ref={videoRef}
              className="video-js vjs-default-skin video-player"
              id="ASL-Glossary-video-player" 
              controls
              preload="auto"
              data-setup="{}"
            >
              <source src={videoUrl} type='video/mp4' />
            </video>
            {/* div onMouseDown={onMouseDown.bind(this, 'resize')} className='control-point point-se'  */}
          </div>
        </div>)}
        <div className='tableBar'>
          {/* https://www.w3.org/WAI/tutorials/forms/labels/#associating-labels-explicitly */}
          <label htmlFor='asl-search-box-edit' className="sr-only">{searchPlaceholder}</label>
          <input
            id='asl-search-box-edit'
            className='searchBox'
            type='text'
            placeholder={`${searchPlaceholder}...`}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='pageNumber'>Page: {(`${pageNumber}/${Math.ceil(length / N_ITEMS_PER_PAGE)}`)}</span>
          <button onClick={handlePrevPage} disabled={(pageNumber <= 1)}>Prev</button>
          <button onClick={handleNextPage} disabled={(pageNumber*N_ITEMS_PER_PAGE >= length)}>Next</button>
          {/* https://www.w3.org/WAI/tutorials/forms/labels/#associating-labels-explicitly */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor='asl-pagebox-edit' className="sr-only">Jump to page</label>
          <input
            id='asl-pagebox-edit'
            className='pageBox'
            type='text'
            onChange={(e) => setJumpNumber(e.target.value)}
          />
          <button onClick={handleJump}>Go</button>
          
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
                  Term
                </button>
              </th>
              <th>
                <button 
                  type="button" 
                  onClick={() => requestSort("kind")}
                  className={getClassNamesFor("kind")}
                >
                  Category
                </button>
              </th>
              <th>Written Equivalent</th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("domain")}
                  className={getClassNamesFor("domain")}
                >
                  Domain
                </button>
              </th>
              <th>
                <button 
                  type="button" 
                  onClick={() => requestSort("source")}
                  className={getClassNamesFor("source")}
                >
                  Source
                </button>
              </th>
              <th>Like</th>
              <th>
                Video
              </th>
            </tr>
          </thead>
          <tbody>
            {onePage.map((term,index) => {
              return (
                <tr key={term.id} aria-rowindex={1 + index + (pageNumber-1) * N_ITEMS_PER_PAGE}>
                  <td>{term.term}</td>
                  <td>
                    {numberToCate(term.kind)}
                  </td>
                  <td>{term.text}</td>
                  <td>{term.domain}</td>
                  <td>
                    <a target="_blank" rel="noopener noreferrer" href={term.websiteURL}>{term.source}</a>
                  </td>
                  <td>
                    {term.likes}
                    <button onClick={() => handleLike(term.id)}>like</button>
                  </td>
                  <td>
                    <button 
                      type='button' 
                      onClick={() => handleVideo(term)}
                    >
                      Watch
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}

export default AslTable;