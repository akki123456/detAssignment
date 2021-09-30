import { LightningElement, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const columns = [
    {label: 'Label',     fieldName: 'label',    type: 'text',    sortable: true},
    {label: 'API Name',  fieldName: 'apiName',  type: 'text',    sortable: true},
    {label: 'Data Type', fieldName: 'dataType', type: 'text',    sortable: true},
    {label: 'Is Custom', fieldName: 'isCustom', type: 'boolean', sortable: true}
];

export default class FieldListComponent extends LightningElement {
    columns = columns;
    objectInfo;
    fields = [];
    sortedBy;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    cardTitle;

    @api objectApiName;
    @api recordId;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    wiredObjectInfo({ error, data }) {
        if (data) {
            this.objectInfo = data;
            this.error = undefined;
            const fieldsMap = this.objectInfo.fields; 
            for (var fieldKey in fieldsMap)  {    
                var field = fieldsMap[fieldKey];
                this.fields.push({  'label'    : field.label,
                                    'apiName'  : field.apiName,
                                    'dataType' : field.dataType,
                                    'isCustom' : field.custom})
            }
            this.cardTitle = 'Field list for ' + this.objectInfo.label;
        } else if (error) {
            this.error = error;
            this.objectInfo = undefined;
        }
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.fields];
       
        cloneData.sort( this.sortBy( sortedBy, sortDirection === 'asc' ? 1 : -1 ) );
        this.fields = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy( field, reverse, primer ) {
        const key = primer ? 
            function( x ) {
                  return primer(x[field]);
              } :
            function( x ) {
                  return x[field];
              };
        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };

    }
}