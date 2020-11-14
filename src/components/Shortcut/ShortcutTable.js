import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

/**
 * @example
 * const shortcuts = [
 *    {
 *      category: 'Playback',
 *      actions: [
 *          {
 *              name: 'Toggle play/pause',
 *              keys: ['space', 'k'] // `Space` or `k`
 *          },{
 *              name: 'Increase playback rate by 0.25 (maximum rate is 4)',
 *              keys: [ ['⇧ Shift', '↑'] ] // `Shift` + `↑`
 *          }
 *      ]
 *    }
 * ]
 */
function ShortcutTable(props) {
  const {
    fullWidth,
    shortcuts = []
  } = props;

  return (
    <div id="ct-shortcuts-table-container" className={cx({ fullWidth })}>
      <span className="shortcuts-table-row">
        {shortcuts.map((catagory) => (
          <div className="shortcuts-table-col" key={catagory.category}>
            {
              catagory.category
              &&
              <h3 className="shortcuts-table-h3">{catagory.category}</h3>
            }
            <table className="shortcuts-table" role="presentation">
              <tbody>
                {catagory.actions.map((action) => (
                  <tr className="shortcuts-tr" key={action.name}>
                    <td className="shortcuts-des">{action.name}</td>
                    <td className="shortcuts-key">
                      {action.keys.map((key, index) => (
                        <ShortcutKey key={action.name} skey={key} or={index > 0} />
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

function ShortcutKey({ skey, or, and }) {
  const isSingle = typeof skey === 'string';
  const isArray = Array.isArray(skey);
  const prefix = or ? 'or' : and ? '+' : '';

  return isSingle ? (
    <span>
      <span className="shortcut-key-prefix">{prefix}</span> <kbd>{skey}</kbd>
    </span>
  ) : isArray ? (
    <span>
      {skey.map((key, index) => <ShortcutKey skey={key} key={key} and={index > 0} />)}
    </span>
  ) : null;
}

ShortcutTable.propTypes = {
  fullWidth: PropTypes.bool,
  shortcuts: PropTypes.arrayOf(PropTypes.shape({
    catagory: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      keys: PropTypes.array
    }))
  }))
};

export default ShortcutTable;

