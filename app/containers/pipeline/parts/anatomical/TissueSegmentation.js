import React, { Component } from 'react';

import { withStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider';

import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControlLabelled from 'components/FormControlLabelled';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Collapse from '@material-ui/core/Collapse';
import Help from 'components/Help'
import {
  SettingsIcon,
} from 'components/icons';

class TissueSegmentation extends Component {

  static styles = theme => ({
  });

  state = {
    fsl: false,
    customized: false,
  }

  handleValueChange = (event) => {
    const name = event.target.name

    const checkBoxes = [
      "anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled",
      "anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled",
    ]

    if (!checkBoxes.includes(name)) {
      this.props.onChange([
        [name, event.target.value]
      ])

    } else {
      const changes = []
      const value = event.target.checked

      if (name == "anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled") {
        changes.push([name, value])
        if (value) {
          changes.push(["anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled", false])
        }
      } else if (name == "anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled") {
        changes.push([name, value])
        if (value) {
          changes.push(["anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled", false])
        }
      }

      this.props.onChange(changes)
    }
  };

  handleOpenFSL = () => {
    this.setState({ fsl: true })
  }
  
  handleOpenCustomized = () => {
    this.setState({ customized: true })
  }

  handleCloseFSL = () => {
    this.setState({ fsl: false })
  }
  
  handleCloseCustomized = () => {
    this.setState({ customized: false })
  }

  render() {
    const { classes, configuration, onChange } = this.props

    return (
      <React.Fragment>

        <FormGroup>
          <FormLabel>
            <Help
              type="pipeline"
              regex={/^runSegmentationPreprocessing/}
              help={`Automatically segment anatomical images into White Matter, Gray Matter, and CSF based on probability maps.`}
            />
            Tissue Segmentation Options 
          </FormLabel>

          <Grid container>
            <Grid item xs={4}>
              <FormGroup row>
                <FormControlLabelled label="Use Priors">
                  <Switch
                    name="anatomical.tissue_segmentation.configuration.seg_use_priors.enabled"
                    checked={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_priors.enabled".split("."))}
                    onChange={onChange}
                    color="primary"
                  />
                </FormControlLabelled>
              </FormGroup>
              <FormGroup row>
                <Help
                  type="pipeline"
                  regex={/^seg_use_threshold/}
                  help={`Choice of using FSL-FAST Thresholding or Customized Thresholding to perform tissue segmentation thresholding. Only one thresholding method can be chosen.`}
                >
                  <FormControlLabel
                    label="FSL-FAST Threshold"
                    control={
                      <Switch
                        name="anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled"
                        checked={configuration.getIn(['anatomical', 'tissue_segmentation', 'configuration', 'seg_use_fast_threshold', 'enabled'])}
                        onChange={this.handleValueChange}
                        color="primary"
                      />
                    }
                  />
                  { configuration.getIn(['anatomical', 'tissue_segmentation', 'configuration', 'seg_use_fast_threshold', 'enabled']) ?
                    <IconButton
                      onClick={() => this.handleOpenFSL()}>
                    </IconButton>
                  : null }

                  <FormControlLabel
                    label="Customized Threshold"
                    control={
                      <Switch
                      name="anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled"
                      checked={configuration.getIn(['anatomical', 'tissue_segmentation', 'configuration', 'seg_use_customized_threshold', 'enabled'])}
                      onChange={this.handleValueChange}
                      color="primary"
                      />
                    }
                  />
                  { configuration.getIn(['anatomical', 'tissue_segmentation', 'configuration', 'seg_use_customized_threshold', 'enabled']) ?
                    <IconButton
                      onClick={() => this.handleOpenCustomized()}>
                    </IconButton>
                  : null }
                  {/* for fork */}
                  {/* <FormControlLabelled label="FSL-FAST Threshold">
                    <Switch
                      name="anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled"
                      checked={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_fast_threshold.enabled".split("."))}
                      onChange={onChange}
                      color="primary"
                    />
                  </FormControlLabelled>
                  <FormControlLabelled label="Customized Threshold">
                    <Switch
                      name="anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled"
                      checked={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled".split("."))}
                      onChange={onChange}
                      color="primary"
                    />
                  </FormControlLabelled> */}
                </Help>
              </FormGroup>
              <FormGroup row>
                <FormControlLabelled label="Erosion">
                  <Switch
                    name="anatomical.tissue_segmentation.configuration.seg_use_erosion.enabled"
                    checked={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_erosion.enabled".split("."))}
                    onChange={onChange}
                    color="primary"
                  />
                </FormControlLabelled>
              </FormGroup>
            </Grid>

            <Grid item xs={8}>
              <Collapse in={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_priors.enabled".split("."))}>               
                <FormGroup>
                  <FormLabel>
                    <Help
                      type="pipeline"
                      help={`Full path to a directory containing binarized prior probability maps.`}
                      fullWidth
                    />
                    Tissue Prior Probability Map
                  </FormLabel>
                  <FormLabel>
                    <Help
                        type="pipeline"
                        regex={/^PRIORS_WHITE/}
                        help={`Full path to a binarized White Matter prior probability map. It is not necessary to change this path unless you intend to use non-standard priors.`}
                        fullWidth
                      >
                        <TextField
                          label="White Matter Prior Probability Map"
                          name="anatomical.tissue_segmentation.configuration.seg_use_priors.priors.white_matter"
                          value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_priors.priors.white_matter".split("."))}
                          onChange={onChange}
                          fullWidth={true} margin="normal" variant="outlined"
                        />
                      </Help>
                  </FormLabel>
 
                  <FormLabel>
                    <Help
                        type="pipeline"
                        regex={/^PRIORS_GRAY/}
                        help={`Full path to a binarized Gray Matter prior probability map. It is not necessary to change this path unless you intend to use non-standard priors.`}
                        fullWidth
                      >
                        <TextField
                          label="Gray Matter Prior Probability Map"
                          name="anatomical.tissue_segmentation.configuration.seg_use_priors.priors.gray_matter"
                          value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_priors.priors.gray_matter".split("."))}
                          onChange={onChange}
                          fullWidth={true} margin="normal" variant="outlined"
                        />
                      </Help>
                  </FormLabel>

                  <FormLabel>
                    <Help
                        type="pipeline"
                        regex={/^PRIORS_CSF/}
                        help={`Full path to a binarized CSF prior probability map. It is not necessary to change this path unless you intend to use non-standard priors.`}
                        fullWidth
                      >
                        <TextField
                          label="Cerebrospinal Fluid Prior Probability Map"
                          name="anatomical.tissue_segmentation.configuration.seg_use_priors.priors.cerebrospinal_fluid"
                          value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_priors.priors.cerebrospinal_fluid".split("."))}
                          onChange={onChange}
                          fullWidth={true} margin="normal" variant="outlined"
                        />
                      </Help>
                  </FormLabel>
                </FormGroup>                   
              </Collapse>

              <Collapse in={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.enabled".split("."))}>
                <FormGroup>
                  <FormLabel>
                    <Help
                      type="pipeline"
                      help={`Set the threshold value for refining the resulting White Matter, Gray Matter, CSF segmentation tissue masks. `}
                    />
                    Threshold 
                  </FormLabel>
                  <FormLabel>
                    <Help
                      type="pipeline"
                      regex={/^seg_WM_threshold_value/}
                      help={`Set the threshold value for refining the resulting White Matter segmentation tissue mask. The default value is 0.95.`}
                      fullWidth
                    >
                      <TextField label="White Matter Threshold Value"
                        name="anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_WM_threshold_value"
                        value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_WM_threshold_value".split("."))}
                        onChange={onChange}
                        fullWidth margin="normal" variant="outlined"
                      />
                    </Help>
                  </FormLabel>

                  <FormLabel>
                    <Help
                      type="pipeline"
                      regex={/^seg_GM_threshold_value/}
                      help={`Set the threshold value for refining the resulting Gray Matter segmentation tissue mask. The default value is 0.95.`}
                      fullWidth
                    >
                      <TextField label="Gray Matter Threshold Value"
                        name="anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_GM_threshold_value"
                        value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_GM_threshold_value".split("."))}
                        onChange={onChange}
                        fullWidth margin="normal" variant="outlined"
                      />
                    </Help>
                  </FormLabel>

                  <FormLabel>
                    <Help
                      type="pipeline"
                      regex={/^seg_CSF_threshold_value/}
                      help={`Set the threshold value for refining the resulting CSF segmentation tissue mask. The default value is 0.95.`}
                      fullWidth
                    >
                      <TextField label="CSF Threshold Value"
                        name="anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_CSF_threshold_value"
                        value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_customized_threshold.threshold.seg_CSF_threshold_value".split("."))}
                        onChange={onChange}
                        fullWidth margin="normal" variant="outlined"
                      />
                    </Help>
                  </FormLabel>
                </FormGroup>
              </Collapse>

              <Collapse in={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_erosion.enabled".split("."))}>
                <FormGroup>
                  <FormLabel>
                    <Help
                      type="pipeline"
                      help={`Set the erosion proportion, if use erosion to erode binarized tissue masks.`}
                    />
                    Erosion 
                  </FormLabel>
                    <FormLabel>
                      <Help
                        type="pipeline"
                        regex={/^seg_erosion_prop/}
                        help={`Set the erosion proportion, if use erosion to erode binarized tissue masks. The default is 0.6.`}
                        fullWidth
                      >
                        <TextField label="Erosion Proportion"
                          name="anatomical.tissue_segmentation.configuration.seg_use_erosion.erosion.seg_erosion_prop"
                          value={configuration.getIn("anatomical.tissue_segmentation.configuration.seg_use_erosion.erosion.seg_erosion_prop".split("."))}
                          onChange={onChange}
                          fullWidth margin="normal" variant="outlined"
                        />
                      </Help>
                    </FormLabel>
                </FormGroup>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
      </React.Fragment>
    )
  }
}

export default withStyles(TissueSegmentation.styles)(TissueSegmentation);
