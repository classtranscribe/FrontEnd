import React, { useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import { Select, Form, Grid } from 'semantic-ui-react'
import { 
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  cc_colorOptions,
  cc_opacityOptions,
  cc_positionOptions,
  cc_fontOptions,
  cc_sizeOptions,

  videoControl,
  getCCSelectOptions
} from '../../../Utils'
import './index.css'

function CCSettingMenu({
  show=false,
  onClose=null,
  openCC=false,

  cc_color=CC_COLOR_WHITE,
  cc_bg=CC_COLOR_BLACK,
  cc_size=CC_SIZE_100,
  cc_opacity=CC_OPACITY_100,
  cc_font=CC_FONT_SANS_SERIF,
  cc_position=CC_POSITION_BOTTOM,

  cc_setColor,
  cc_setBG,
  cc_setSize,
  cc_setOpacity,
  cc_setFont,
  cc_setPosition,
}) {

  const handleSelection = (value, setFunc) => {
    setFunc(value)
  }

  const bgStyle = {
    backgroundColor: cc_bg,
    opacity: cc_opacity,
    color: cc_color,
    fontSize: cc_size + 'rem',
    fontFamily: cc_font,
  }

  return show ? (
    <div className="watch-ccsetting-menu">
      <button className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>
      <div className="ccsetting-demo-area">
        <h2>Sample Caption</h2>
        <div className="ccsetting-demo-box" style={bgStyle}>
          Lorem ipsum dolor sit amet, soleat ornatus menandri mei cu, legere regione aperiri duo te, debet maiestatis per no.
        </div>
      </div>
      <div className="ccsetting-selection-area">
        <Grid stackable columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Select}
                label="Caption Position"
                aria-label="Caption Position"
                options={getCCSelectOptions(cc_positionOptions)}
                value={cc_position}
                onChange={(event, {value}) => handleSelection(value, cc_setPosition)}
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
                onChange={(event, {value}) => handleSelection(value, cc_setFont)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Select}
                label="Background Color"
                aria-label="Background Color"
                options={getCCSelectOptions(cc_colorOptions)}
                value={cc_bg}
                onChange={(event, {value}) => handleSelection(value, cc_setBG)}
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
                onChange={(event, {value}) => handleSelection(value, cc_setColor)}
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
                options={getCCSelectOptions(cc_sizeOptions, item => item * 100 + '%')}
                value={cc_size}
                onChange={(event, {value}) => handleSelection(value, cc_setSize)}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field
                fluid 
                control={Select}
                label="Background Opacity"
                aria-label="Background Opacity"
                options={getCCSelectOptions(cc_opacityOptions, item => item * 100 + '%')}
                value={cc_opacity}
                onChange={(event, {value}) => handleSelection(value, cc_setOpacity)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  ) : null
}

export default connectWithRedux(
  CCSettingMenu,
  ['openCC', 'cc_color', 'cc_bg', 'cc_size', 'cc_opacity', 'cc_font', 'cc_position'],
  ['cc_setColor', 'cc_setBG', 'cc_setSize', 'cc_setOpacity', 'cc_setPosition', 'cc_setFont']
)