import React, { useState, useMemo, useEffect, useRef, useCallback} from 'react';
import { Resizable } from 'react-resizable';
import './index.scss';
import "rsuite/dist/rsuite.css";
import axios from 'axios';

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
    const ONE_PAGE_NUM = 50 // one page will have at most 50 glossaries
    const { items, requestSort, sortConfig } = useSortableData(props.words);
    const [pageNumber, setPageNumber] = useState(1); // the page number is at first 1
    const [jumpNumber, setJumpNumber] = useState(1);
    const [length, setLength] = useState(0); // the length of filtered items is set to 0
    const [search, setSearch] = useState(''); // search text is at first empty
    const [onePage, setOnePage] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const wrapStyle = {
      left: 100,
      top: 100,
      width: 500,
      height: 500
    }
    const [style, setStyle] = useState({
        left: 100,
        top: 100,
        width: 400,
        height: 200
    })
    // 初始数据， 因为不需要重新render 所以用 useRef
    const oriPos = useRef({
        top: 0, // 元素的坐标
        left: 0,
        cX: 0, // 鼠标的坐标
        cY: 0
    })
    const isDown = useRef(false);
    const direction = useRef();

    function transform(direction, oriPos, e) {
      const style = {...oriPos.current}
      const offsetX = e.clientX - oriPos.current.cX;
      const offsetY = e.clientY - oriPos.current.cY;
      switch (direction.current) {
          // 拖拽移动
          case 'move' :
              // 元素当前位置 + 偏移量
              const top = oriPos.current.top + offsetY;
              const left = oriPos.current.left + offsetX;
              // 限制必须在这个范围内移动 画板的高度-元素的高度
              style.top = top
              style.left = left;
              break
          case 'se':
              style.height += offsetY;
              style.width += offsetX;
              break
      }
      return style
    }
    // 鼠标被按下
    const onMouseDown = useCallback((dir, e) => {
        // 阻止事件冒泡
        e.stopPropagation();
        // 保存方向。
        direction.current = dir;
        isDown.current = true;
        // 然后鼠标坐标是
        const cY = e.clientY; // clientX 相对于可视化区域
        const cX = e.clientX;
        oriPos.current = {
            ...style,
            cX, cY
        }
    })
    
    // 鼠标移动
    const onMouseMove = useCallback((e) => {
        // 判断鼠标是否按住
        if (!isDown.current) return
        let newStyle = transform(direction, oriPos, e);
        setStyle(newStyle);
    })

    const onMouseUp = useCallback((e) => {
      console.log(e, 'onMouseUp');
      isDown.current = false;
    }, [])

    const constStyle = {
      zIndex:'11', 
      position:'fixed',
    }

    const apiInstance = axios.create({
      baseURL: 'https://ct-dev.ncsa.illinois.edu',
      timeout: 1000,
    });

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

    const numberToCate = (num) => {
      if (num === 1) {
        return 'Sign'
      }
      if (num === 2) {
        return 'Definition'
      }
      return 'Example'
    }

    const handleVideo = (source, uniqueASLIdentifier) => {
      const hostName = window.location.hostname;
      if (hostName !== '') {
        if (source === 'ASLCORE') {
          setVideoUrl(`https://ct-dev.ncsa.illinois.edu/data/aslvideos/aslcore/original/${uniqueASLIdentifier}.mp4`);
        } else {
          setVideoUrl(`https://${hostName}/data/aslvideos/deaftec/original/${uniqueASLIdentifier}.mp4`);
        }
      }
      setShowVideo(true);
    }

    const handlePrevPage = () => {
      let newPage = Math.ceil(pageNumber-1);
      if (newPage < 0) {
        setPageNumber(0);
      } else {
        setPageNumber(newPage);
      }
    }

    const handleNextPage = () => {
      let newPage = Math.ceil(pageNumber-1);
      if (newPage*ONE_PAGE_NUM >= length) {
        setPageNumber(Math.ceil(length / ONE_PAGE_NUM));
      } else {
        setPageNumber(newPage);
      }
    }

    const handleLike = (termId) => {
      apiInstance.put(`/api/ASLVideo/Upvote/${termId}`).then(response => {
        if (response.status === 200) {
          // success, update like number
          const index = onePage.findIndex((ele) => ele.id === termId);
          const newArray = [...onePage];
          
          if (index !== -1) {
            const newTerm = {...newArray[index]};
            newTerm.likes += 1;
            newArray[index] = newTerm;
            setOnePage(newArray);
          }
        }
      })
    }
    const points = ['se']

    return (
      <div>
        {showVideo && (
        <div 
          className="drawing-wrap"
          onMouseDown={onMouseDown.bind(this, 'move')} 
          onMouseUp={onMouseUp} 
          onMouseMove={onMouseMove}
        > 
          <div className="drawing-item" style={style}>
            <button 
              id='close-button'
              onClick={() => setShowVideo(false)}
            >X
            </button>

            <video 
              className="video-js vjs-default-skin video-player" 
              controls
              preload="auto"
              data-setup="{}"
            >
            <source src={videoUrl} type='video/mp4' />
            </video>
            <div onMouseDown={onMouseDown.bind(this, 'se')} className={`control-point point-se`} ></div>
          </div>
        </div>)}
        <div className='tableBar'>
          <input 
            className='searchBox'
            type='text'
            placeholder='search for ASL Glossaries' 
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='pageNumber'>Page: {(`${pageNumber}/${Math.ceil(length / ONE_PAGE_NUM)}`)}</span>
          <button onClick={handlePrevPage} disabled={(pageNumber===1)}>Prev</button>
          <button onClick={handleNextPage} disabled={(pageNumber*ONE_PAGE_NUM >= length)}>Next</button>
          <input className='pageBox' type='text' onChange={(e) => setJumpNumber(e.target.value)} />
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
            {onePage.map((term, i) => {
              return (
                <tr key={term.id}>
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
                      onClick={() => handleVideo(term.source, term.uniqueASLIdentifier)}
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