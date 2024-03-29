import React, { Component } from 'react';

import { withStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';

import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { fromJS } from 'immutable';

import {
  AddIcon,
  DeleteIcon
} from 'components/icons';

import Help from 'components/Help'


class TimeSeriesExtraction extends Component {

  static styles = theme => ({
    paper: { flexGrow: 1, padding: theme.spacing(), marginBottom: theme.spacing(2) },
    footer: { textAlign: 'right', padding: theme.spacing(2) }
  });

  addMask = (event) => {
    const { configuration, onChange } = this.props
    const next = configuration.getIn(['derivatives', 'timeseries_extraction', 'masks']).size

    onChange([
      [
        `derivatives.timeseries_extraction.masks.${next}`,
        fromJS({
          mask: '',
          average: false,
          voxel: false,
          spatial_regression: false,
          pearson_correlation: false,
          partial_correlation: false,
        })
      ]
    ])
  }

  removeMask = (i) => {
    const { classes, configuration, onChange } = this.props

    const masks = configuration.getIn(['derivatives', 'timeseries_extraction', 'masks']).delete(i)

    onChange([
      [['derivatives', 'timeseries_extraction', 'masks'], masks]
    ])

  }

  render() {
    const { classes, configuration, onChange } = this.props

    const config = configuration.getIn(['derivatives', 'timeseries_extraction'])

    return (
      <Grid container>
        <Grid item sm={12}>

          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Help
                      type="pipeline"
                      regex={/^tsa_roi_paths/}
                      help={`Paths to region-of-interest (ROI) NIFTI files (.nii or .nii.gz) to be used for time-series extraction, and then select which types of analyses to run.`}
                    />
                  </TableCell>
                  <TableCell>Roi Image</TableCell>
                  <TableCell padding="checkbox">Average</TableCell>
                  <TableCell padding="checkbox">Voxel</TableCell>
                  <TableCell padding="checkbox">Spatial Regression</TableCell>
                  <TableCell padding="checkbox">Pearson correlation</TableCell>
                  <TableCell padding="checkbox">Partial correlation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                config.get('masks').size == 0 ? (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    Add new rows with the "+" below.
                  </TableCell>
                </TableRow>
                ) : (
                  config.get('masks').map((mask, i) => (
                <TableRow key={i}>
                  <TableCell padding="checkbox">
                    <IconButton className={classes.button} onClick={() => this.removeMask(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth={true}
                      name={`derivatives.timeseries_extraction.masks.${i}.mask`}
                      onChange={onChange}
                      value={mask.get('mask')}
                      helperText=''
                      />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      name={`derivatives.timeseries_extraction.masks.${i}.average`}
                      onChange={onChange}
                      checked={mask.get('average')}
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      name={`derivatives.timeseries_extraction.masks.${i}.voxel`}
                      onChange={onChange}
                      checked={mask.get('voxel')}
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      name={`derivatives.timeseries_extraction.masks.${i}.spatial_regression`}
                      onChange={onChange}
                      checked={mask.get('spatial_regression')}
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      name={`derivatives.timeseries_extraction.masks.${i}.pearson_correlation`}
                      onChange={onChange}
                      checked={mask.get('pearson_correlation')}
                    />
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      name={`derivatives.timeseries_extraction.masks.${i}.partial_correlation`}
                      onChange={onChange}
                      checked={mask.get('partial_correlation')}
                    />
                  </TableCell>
                </TableRow>
              )))}
              </TableBody>
              <TableFooter>
                <TableRow >
                  <TableCell padding="checkbox" colSpan={7} className={classes.footer}>
                    <Fab aria-label="Add new ROI" onClick={this.addMask}>
                      <AddIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>

          <FormGroup>
            <FormLabel>
              <Help
                type="pipeline"
                regex={/^roiTSOutputs/}
                help={`By default, extracted time series are written as both a text file and a 1D file. Additional output formats are as a .csv spreadsheet or a Numpy array.`}
              />
              Outputs
            </FormLabel>
            <FormGroup row>
              <FormControlLabel
                label="Comma-separated values (CSV)"
                control={
                  <Switch
                    name="derivatives.timeseries_extraction.outputs.csv"
                    checked={config.getIn(['outputs', 'csv'])}
                    onChange={onChange}
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                label="Numpy"
                control={
                  <Switch
                    name="derivatives.timeseries_extraction.outputs.numpy"
                    checked={config.getIn(['outputs', 'numpy'])}
                    onChange={onChange}
                    color="primary"
                  />
                }
              />
            </FormGroup>
          </FormGroup>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(TimeSeriesExtraction.styles)(TimeSeriesExtraction);
