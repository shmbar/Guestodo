import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ExcelExport, ExcelExportColumn  } from '@progress/kendo-react-excel-export';

class ExportData extends Component{
 
    _exporter;
    export = () => {this._exporter.save(); }
    
    render(){
        const {data, cols} = this.props;
        let columns = cols.filter(k => !k.el).map((f, i) =>
                        (<ExcelExportColumn key={f.field}
                                            field={f.field}
                                            title={f.header}
                                            headerCellOptions={{background: '#3498db', textAlign: 'center', bold: true }}
                                            cellOptions={{ textAlign: 'center' }} />)
                    );
        return(
            <div>
                <Tooltip title="Download">           
                        <IconButton onClick={this.export}  style={{outline:'none'}}>
                            <SvgIcon className='iconHover'>
                                <path d="M17,13L12,18L7,13H10V9H14V13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                            </SvgIcon>
                        </IconButton>
                </Tooltip>
               <ExcelExport  data={data}  fileName="Dataname.xlsx" ref={(exporter) => { this._exporter = exporter; }} >
                    {columns}
                </ExcelExport>
            </div>
           );
       }
   }
    
export default ExportData;    
