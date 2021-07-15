import React from 'react';
import { shortcuts } from '../../../Utils';
import './index.scss';

function ShortcutsTable({ onClose = null }) {
  return (
    <div id="watch-shortcuts-table-container">
      <div className="w-100 d-flex justify-content-between">
        <h2 className="shortcuts-table-h2">Keyboard Shortcuts</h2>
        <button className="plain-btn watch-menu-close-btn" onClick={onClose}>
          <i className="material-icons">close</i>
        </button>
      </div>

      <span className="shortcuts-table-row">
        {shortcuts.map((catagory) => (
          <div className="shortcuts-table-col" key={catagory.name}>
            <h3 className="shortcuts-table-h3">{catagory.name}</h3>
            <table className="shortcuts-table" role="presentation">
              <tbody>
                {catagory.rows.map((row) => (
                  <tr className="shortcuts-tr" key={row.action}>
                    <td className="shortcuts-des">{row.action}</td>
                    <td className="shortcuts-key">
                      {row.keys.map((key, index) => (
                        <ShortcutKey skey={key} key={row.action} index={index} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </span>
    </div>
  );
}

export function ShortcutKey({ skey, index }) {
  const prefix = index > 0 ? ' or ' : '';
  const { key1, key2 } = skey;
  return (
    <>
      {prefix}
      <kbd>{key1}</kbd>
      {key2 && (
        <>
          {' '}
          + <kbd>{key2}</kbd>
        </>
      )}
    </>
  );
}

export default ShortcutsTable;
