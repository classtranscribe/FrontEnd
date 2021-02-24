import React from 'react';
import { Select, Form, Grid } from 'semantic-ui-react';
import { connect } from 'dva'
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  cc_colorOptions,
  cc_opacityOptions,
  // cc_positionOptions,
  // cc_fontOptions,
  cc_sizeOptions,
  getCCStyle,
  getCCSelectOptions,
} from '../../../../Utils';

const CC_EXAMPLE = 'This is an example of closed caption';

function SettingMenu({
  cc_color = CC_COLOR_WHITE,
  cc_bg = CC_COLOR_BLACK,
  cc_size = CC_SIZE_100,
  cc_opacity = CC_OPACITY_100,
  cc_font = CC_FONT_SANS_SERIF,
  cc_position = CC_POSITION_BOTTOM,
  dispatch
}) {
  const { ccStyle } = getCCStyle({
    cc_color,
    cc_bg,
    cc_size,
    cc_opacity,
    cc_font,
    cc_position,
  });

  return (
    <div className="w-100">
      <div className="ccstyle-demo-area">
        {/* <h2>Sample Caption</h2> */}
        <div className="ccstyle-demo-box" style={ccStyle}>
          {CC_EXAMPLE}
        </div>
      </div>
      <div className="ccstyle-selection-area">
        <Grid stackable columns="equal">
          {/* <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Select}
                label="Caption Position"
                aria-label="Caption Position"
                options={getCCSelectOptions(cc_positionOptions)}
                value={cc_position}
                onChange={(event, {value}) => transControl.ccPosition(value)} /// plz USE DISPATCH
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Select}
                label="Font Family"
                aria-label="Font Family"
                options={getCCSelectOptions(cc_fontOptions)}
                value={cc_font}
                onChange={(event, {value}) => transControl.ccFont(value)} /// plz USE DISPATCH
              />
            </Grid.Column>
          </Grid.Row> */}

          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                control={Select}
                label="Background Color"
                aria-label="Background Color"
                options={getCCSelectOptions(cc_colorOptions)}
                value={cc_bg}
                onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { cc_bg: value } })}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid
                control={Select}
                label="Font Color"
                aria-label="Font Color"
                options={getCCSelectOptions(cc_colorOptions)}
                value={cc_color}
                onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { cc_color: value } })}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                control={Select}
                label="Font Size"
                aria-label="Font Size"
                options={getCCSelectOptions(cc_sizeOptions, (item) => `${item * 100}%`)}
                value={cc_size}
                onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { cc_size: value } })}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid
                control={Select}
                label="Background Opacity"
                aria-label="Background Opacity"
                options={getCCSelectOptions(cc_opacityOptions, (item) => `${item * 100}%`)}
                value={cc_opacity}
                onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { cc_opacity: value } })}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
}

export default connect(({ playerpref: { cc_color, cc_bg, cc_size, cc_opacity, cc_font, cc_position, }, loading }) => ({
  cc_color, cc_bg, cc_size, cc_opacity, cc_font, cc_position,
}))(SettingMenu);
