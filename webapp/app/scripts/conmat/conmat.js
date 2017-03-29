var deepSeek = require('safe-access');
var h = require('virtual-dom/h');
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var convertHTML = require('html-to-vdom')({
     VNode: VNode,
     VText: VText
});
var Messages = require('../messages.js').Messages;
var focusTo = require('../lib/mixins.js').focusTo;
var bindTableResize = require('../lib/mixins.js').bindTableResize;
var clone = require('../lib/mixins.js').clone;
var View = require('./view.js')();
var Update = require('./update.js')();

var CM = {
  actions: {
    //rewrite in view rules 
    selectParams: () => {
      $(document).on('change','.conMatControls', {} ,
          e=>{
            let params = $('.conMatControls input:checked').map(
              function() {return {
              param:$(this).attr('data-param'),
              value:$(this).attr('data-value')
              };
            });
            let sels = _.groupBy(_.toArray(
              $('.conMatControls option:checked').map(
                function() {return {
                param:$(this).attr('data-param'),
                value:$(this).attr('data-value')
                };
            })),"param");
            let newparams = _.groupBy(_.toArray(params),"param");
            newparams = _.extend(newparams,sels);
            newparams = _.mapObject(newparams, (v,k) => {
              let vals = _.map(v, vv => {return vv.value});
              if(k!=='intvs'){
                vals = _.first(vals);
              }
              return vals;
            });
            Update(CM.model).selectParams(newparams);
      });
    },
    selectAllInts: () => {
      $(document).on('click','#checkAllIntvs', {} ,
        e=>{
          Update(CM.model).checkAllIntvs();
      });
      $(document).on('click','#uncheckAllIntvs', {} ,
        e=>{
          Update(CM.model).uncheckAllIntvs();
      });
    },
    createMatrix: () => {
       Update(CM.model).createMatrix();
    },
    clearMatrix: () => {
       Update(CM.model).clearMatrix();
    },
    cancelMatrix: () => {
       Update(CM.model).cancelMatrix();
    },
    downloadCSV: () => {
       Update(CM.model).downloadCSV();
    },
  },
  //has to be incorporated to view module
  view: {
    register: (model) => {
      CM.model = model;
      model.Actions.ConMat = CM.actions;
      CM.actions.selectParams();
      CM.actions.selectAllInts();
    },
  },
  //has to be incorporated to update module rewrite netplot nad project
  update: {
    updateState: (model) => {
      // console.log("updatingState in conmat");
      if ( _.isUndefined(deepSeek(CM,'model.getState().project.CM'))){
        CM.model = model;
        Update(CM.model).setState({
          contributionMatrices: [],
          currentCM: {
            hatmatrix:[],
            savedComparisons: [],
            params: {
              MAModel: {},
              sm: {},
              intvs: [],
              rule: {},
              tau: 0
            },
            status: "empty", //empty, loading, canceling, ready
            progress: 0,
            currentRow: 'Hat Matrix'
          },
        });
      }else{
        if( (deepSeek(CM,'model.getState().project.CM.currentCM.status')==='loading')){
          Update(CM.model).createMatrix();
        }
        if( (deepSeek(CM,'model.getState().project.CM.currentCM.status')==='canceling')){
            Update(CM.model).clearMatrix();
        }
        if( (deepSeek(CM,'model.getState().project.CM.currentCM.status')==='ready')){
        }
        Update(CM.model).updateChildren();
      }
    },
  },
  render: (model) => {
    if(View(model).isReady()){
      var tmpl = GRADE.templates.conmatrix(View(model));
      return h("div#contMatContainer.col-xs-12",convertHTML(tmpl));
    }else{
      console.log('conMat not ready');
    }
  },
  afterRender: () => {
    if(($("#cm-table")).is(':empty')){
      Update(CM.model).showTable();
    }
  },
}

module.exports = () => {
  return CM;
}