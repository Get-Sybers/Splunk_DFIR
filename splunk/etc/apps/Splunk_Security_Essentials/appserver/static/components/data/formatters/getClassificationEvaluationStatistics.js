(function() {
  define(function(require, exports, module) {
    var _getClassificationEvaluationStatistics, getClassificationEvaluationStatistics, makeZerosList;
    makeZerosList = function(count) {
      var i, j, ref, results;
      results = [];
      for (i = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        results.push(0);
      }
      return results;
    };
    _getClassificationEvaluationStatistics = function(truePositivesList, trueNegativesList, falsePositivesList, falseNegativesList) {
      var accuracy, accuracySum, averageAccuracy, averagePrecision, averageRecall, classCount, classIndex, falseNegatives, falsePositives, j, precision, precisionSum, recall, recallSum, ref, trueNegatives, truePositives;
      classCount = truePositivesList.length;
      precisionSum = 0;
      recallSum = 0;
      accuracySum = 0;
      for (classIndex = j = 0, ref = classCount; 0 <= ref ? j < ref : j > ref; classIndex = 0 <= ref ? ++j : --j) {
        truePositives = truePositivesList[classIndex] || 0;
        trueNegatives = trueNegativesList[classIndex] || 0;
        falsePositives = falsePositivesList[classIndex] || 0;
        falseNegatives = falseNegativesList[classIndex] || 0;
        precision = truePositives / (truePositives + falsePositives);
        if (isNaN(precision)) {
          precision = 0;
        }
        recall = truePositives / (truePositives + falseNegatives);
        if (isNaN(recall)) {
          recall = 0;
        }
        accuracy = (truePositives + trueNegatives) / (truePositives + trueNegatives + falsePositives + falseNegatives);
        if (isNaN(accuracy)) {
          accuracy = 0;
        }
        precisionSum = precisionSum + precision;
        recallSum = recallSum + recall;
        accuracySum = accuracySum + accuracy;
      }
      averagePrecision = precisionSum / classCount;
      averageRecall = recallSum / classCount;
      averageAccuracy = accuracySum / classCount;
      return [averagePrecision, averageRecall, averageAccuracy];
    };
    return getClassificationEvaluationStatistics = function(data) {
      var accuracy, classCount, classIndex, classLabelToIndex, count, countIndex, fOne, falseNegativesList, falsePositivesList, field, fieldCount, fieldIndex, fields, j, k, l, len, len1, len2, m, precision, predictionClassIndex, predictionClassLabel, predictionClassLabelIndex, recall, ref, ref1, row, rows, targetClassIndex, targetClassLabel, targetClassLabelIndex, trueNegativesList, truePositivesList;
      rows = data.rows;
      fields = data.fields;
      if ((rows == null) || (fields == null)) {
        return;
      }
      fieldCount = fields.length;
      if (fieldCount !== 3) {
        return;
      }
      fieldIndex = 0;
      for (j = 0, len = fields.length; j < len; j++) {
        field = fields[j];
        if (field === "target") {
          targetClassLabelIndex = fieldIndex;
        } else if (field === "prediction") {
          predictionClassLabelIndex = fieldIndex;
        } else {
          countIndex = fieldIndex;
        }
        fieldIndex = fieldIndex + 1;
      }
      classLabelToIndex = {};
      classCount = 0;
      for (k = 0, len1 = rows.length; k < len1; k++) {
        row = rows[k];
        targetClassLabel = row[targetClassLabelIndex];
        if (classLabelToIndex[targetClassLabel] == null) {
          classLabelToIndex[targetClassLabel] = classCount;
          classCount = classCount + 1;
        }
      }
      truePositivesList = makeZerosList(classCount);
      trueNegativesList = makeZerosList(classCount);
      falsePositivesList = makeZerosList(classCount);
      falseNegativesList = makeZerosList(classCount);
      for (l = 0, len2 = rows.length; l < len2; l++) {
        row = rows[l];
        targetClassLabel = row[targetClassLabelIndex];
        predictionClassLabel = row[predictionClassLabelIndex];
        count = parseInt(row[countIndex]);
        targetClassIndex = classLabelToIndex[targetClassLabel];
        predictionClassIndex = classLabelToIndex[predictionClassLabel];
        if (targetClassIndex === predictionClassIndex) {
          truePositivesList[targetClassIndex] = count;
        } else {
          falseNegativesList[targetClassIndex] = count;
        }
        for (classIndex = m = 0, ref = classCount; 0 <= ref ? m < ref : m > ref; classIndex = 0 <= ref ? ++m : --m) {
          if (targetClassIndex !== classIndex) {
            if (predictionClassIndex === classIndex) {
              falsePositivesList[classIndex] = falsePositivesList[classIndex] + count;
            } else {
              trueNegativesList[classIndex] = trueNegativesList[classIndex] + count;
            }
          }
        }
      }
      ref1 = _getClassificationEvaluationStatistics(truePositivesList, trueNegativesList, falsePositivesList, falseNegativesList), precision = ref1[0], recall = ref1[1], accuracy = ref1[2];
      fOne = 2 * precision * recall / (precision + recall);
      if (isNaN(fOne)) {
        fOne = 0;
      }
      return {
        "precision": precision,
        "recall": recall,
        "accuracy": accuracy,
        "fOne": fOne
      };
    };
  });

}).call(this);
