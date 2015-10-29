
var app = angular.module('sudoku', ['firebase'])
    .controller('SudokuController', function($scope,$firebase) {
        $scope.board = []; /*{
                column: [{value: 4, locked: true},{value:2, locked: true},{value:null, locked: false},{value:9, locked: true},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:1, locked: true},{value:5, locked: true}]
            },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:3, locked: true},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:4, locked: true}]
            },
            {
                column: [{value:3, locked: true},{value:1, locked: true},{value:7, locked: true},{value:8, locked: true},{value:4, locked: true},{value:null, locked: false},{value:2, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:null, locked: false},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:8, locked: true},{value:null, locked: false},{value:9, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:8, locked: true},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:3, locked: true}]
            },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:9, locked: true},{value:null, locked: false},{value:6, locked: true},{value:null, locked: false},{value:1, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:1, locked: true},{value:6, locked: true},{value:5, locked: true},{value:null, locked: false},{value:3, locked: true},{value:null, locked: false},{value:7, locked: true},{value:2, locked: true},{value:null, locked: false}]
            },
            {
                column: [{value:2, locked: true},{value:null, locked: false},{value:4, locked: true},{value:7, locked: true},{value:null, locked: false},{value:8, locked: true},{value:6, locked: true},{value:3, locked: true},{value:null, locked: false}]
            },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:2, locked: true},{value:null, locked: false},{value:5, locked: true},{value:null, locked: false}]
            }
        ];*/
        var initialBoard = [{
            column: [{value: 4, locked: true},{value:2, locked: true},{value:null, locked: false},{value:9, locked: true},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:1, locked: true},{value:5, locked: true}]
        },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:3, locked: true},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:4, locked: true}]
            },
            {
                column: [{value:3, locked: true},{value:1, locked: true},{value:7, locked: true},{value:8, locked: true},{value:4, locked: true},{value:null, locked: false},{value:2, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:null, locked: false},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:8, locked: true},{value:null, locked: false},{value:9, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:8, locked: true},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:7, locked: true},{value:null, locked: false},{value:null, locked: false},{value:3, locked: true}]
            },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:9, locked: true},{value:null, locked: false},{value:6, locked: true},{value:null, locked: false},{value:1, locked: true},{value:null, locked: false},{value:null, locked: false}]
            },
            {
                column: [{value:1, locked: true},{value:6, locked: true},{value:5, locked: true},{value:null, locked: false},{value:3, locked: true},{value:null, locked: false},{value:7, locked: true},{value:2, locked: true},{value:null, locked: false}]
            },
            {
                column: [{value:2, locked: true},{value:null, locked: false},{value:4, locked: true},{value:7, locked: true},{value:null, locked: false},{value:8, locked: true},{value:6, locked: true},{value:3, locked: true},{value:null, locked: false}]
            },
            {
                column: [{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:null, locked: false},{value:2, locked: true},{value:null, locked: false},{value:5, locked: true},{value:null, locked: false}]
            }
        ];

        var dataRef = new Firebase('https://shining-torch-7518.firebaseio.com/');
        var fb = $firebase(dataRef);
        var syncObj = fb.$asObject();

        syncObj.$bindTo($scope,'$scope.board');

        $scope.Restart = function() {
            dataRef.set(initialBoard);
        };

        $scope.buttonCheck = function() {
            if(checkIfComplete($scope)) {
                alert("You have completed the puzzle");
            }
            else
            {
                alert("Invalid solution, check console for row evaluation");
            }
        };

        dataRef.on('value', function(snapshot) {
            $scope.board = snapshot.val();
        });

        dataRef.on('child_changed', function(snapshot){
            $scope.board = snapshot.val();
        });

        var checkIfComplete = function($scope) {

            for(var i = 0 ; i < 9 ; i++) {
                var tmpRow = [];
                for(var j = 0 ; j < 9 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
                console.log("Row " + (i+1) + " is: " + sumArray(tmpRow));
                if(!sumArray(tmpRow)) {
                    return false;
                }
            }

            for(var i = 0 ; i < 9 ; i++) {
                var tmpRow = [];
                for(var j = 0 ; j < 9 ; j++){
                    tmpRow.push(valueOfBoardAt(j,i,$scope));
                }
                if(!sumArray(tmpRow)) {
                    return false;
                }
            }

            var tmpRow = [];
            for(var i = 0 ; i < 3 ; i++) {
                for(var j = 0 ; j < 3 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 3 ; i < 6 ; i++) {
                for(var j = 0 ; j < 3 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 3 ; i < 6 ; i++) {
                for(var j = 0 ; j < 3 ; j++){
                    tmpRow.push(valueOfBoardAt(j,i,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 6 ; i < 9 ; i++) {
                for(var j = 0 ; j < 3 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 6 ; i < 9 ; i++) {
                for(var j = 0 ; j < 3 ; j++){
                    tmpRow.push(valueOfBoardAt(j,i,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 3 ; i < 6 ; i++) {
                for(var j = 3 ; j < 6 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }

            var tmpRow = [];
            for(var i = 6 ; i < 9 ; i++) {
                for(var j = 6 ; j < 9 ; j++){
                    tmpRow.push(valueOfBoardAt(i,j,$scope));
                }
            }
            if(!sumArray(tmpRow)) {
                return false;
            }
            return true;
        };

        var sumArray = function(array) {
            var sum =0;
            for(key in array) {
                sum += parseInt(array[key],10) ;

            }
            if(sum === 45){
                return true;
            }
            return false;

        };

        var valueOfBoardAt = function (row, col, $scope) {
            return $scope.board[row].column[col].value;
        };

        $scope.checkModThree = function (rowNumber) {
            return rowNumber%3 === 0;
        };

        $scope.ClickCell = function (outer, inner) {

            if($scope.board[outer].column[inner].locked === true) {

            }

            else {
                dataRef.child(outer).child('column').child(inner).child('value').transaction(function (currentValue) {

                    if(currentValue === 9) {
                        return null;
                    }
                    return (currentValue || 0) +1;
                }, function(error,comitted,snapshot) {

                });
            }

        };
    });
