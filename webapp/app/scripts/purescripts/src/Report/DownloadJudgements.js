//module DownloadJudgements
"use strict";


exports.downloadJudgements = function () {
  if (typeof window.Model !== 'undefined'){
    if (typeof window.Model.state !== 'undefined'){
      if (typeof window.Model.state.project !== 'undefined'){
        const json2csv = window.Actions.json2csv;
        const download = window.Actions.download;
        var project = window.Model.getState().project;
        var cm = window.Model.getState().project.CM.currentCM;
        var fields = 
          ["Comparison"
          , "Number of studies"
          ,"Study Limitations"
          , "Imprecision"
          , "Heterogeneity"
          , "Incoherence"
          , "Indirectness"
          , "Publication bias"
          , "Confidence rating"
          ]
        var report = project.report;
        var directs =  report.directRows;
        var indirects =  report.indirectRows;
        var rownames = project.CM.currentCM.hatmatrix.rowNames;
        var parseRow = function (row) {
        var rid = rownames.find(function(n){
          var t1 = n.split(":")[0].toString();
          var t2 = n.split(":")[1].toString();
          var armA = row.armA.toString();
          var armB = row.armB.toString();
          return (armA===t1 && armB===t2) || (armA===t2 && armB===t1)
        });
        var out = {};
          out[fields[0]] = rid; 
          out[fields[1]] = row.numberOfStudies;
          out[fields[2]] = row.studyLimitation.label;
          out[fields[3]] = row.imprecision.label;
          out[fields[4]] = row.heterogeneity.label;
          out[fields[5]] = row.incoherence.label;
          out[fields[6]] = row.indirectness.label;
          out[fields[7]] = row.pubbias.label
          out[fields[8]] = row.judgement.selected.label;
          return out;
        }
        report = [].concat(directs.map(function(r){return parseRow(r)})
                          ,indirects.map(function(r){return parseRow(r)}));
        var csvTable = json2csv.parse(report, {fields: fields});
        var csvContent = 'data:text/csv;charset=utf-8,'+csvTable;
        var encodedUri = encodeURI(csvContent);
        var filename = (project.title+'_'+cm.params.MAModel+'_'+cm.params.sm+"_Report").replace(/\,/g,'_')+'.csv';
        download(encodedUri,filename);
      }
    }
  }
};