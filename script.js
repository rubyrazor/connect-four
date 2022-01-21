(function () {
    var allSlots = $(".slot");
    // var victoryMessage = $("#victoryMessage");

    var currPlayer = "Red";
    var numCols = 6;
    var numRows = 5;
    var connect = 4;

    var winningCheckers = [];
    var winsYellow = 0;
    var winsRed = 0;

    $(".column").on("click", startGame);

    function startGame(e) {
        var col = $(e.currentTarget);
        var slotsInCol = col.children();

        var slotsInRow;
        var indexLastChecker;
        var rowLastChecker;
        var slotsInDiagonalBottomUp = $([]);
        var slotsInDiagonalTopDown = [];

        //DETERMINES ROW-NUMBER OF LAST CHECKER (TO BE) DROPPED && ADDS CLASS OF CURRENT PLAYER ACCORDINGLY (IF ROW FULL, IT RETURNS)
        for (var i = slotsInCol.length - 1; i >= 0; i--) {
            var freeSlot =
                !slotsInCol.eq(i).hasClass("Red") &&
                !slotsInCol.eq(i).hasClass("Yellow");

            if (freeSlot) {
                slotsInCol.eq(i).addClass(currPlayer);
                break;
            }
        }

        if (i === -1) {
            return;
        }

        // DETERMINES THE INDEX OF CHECKER LAST DROPPED
        for (var j = 0; j <= numCols; j++) {
            if (col.hasClass("col" + j)) {
                indexLastChecker = i + j * 6;
            }
        }

        slotsInRow = $(".row" + i);
        rowLastChecker = i;

        // DETERMINES DIAGONAL SLOTS LEFT OF LAST CHECKER DROPPED AND PUSHES THEM INTO CORRESPONDING ARRAY (BOTTOM-UP OR TOP-DOWN)
        for (var k = 1; k < connect; k++) {
            if (rowLastChecker - k >= 0 && indexLastChecker + k * 5 <= 41) {
                slotsInDiagonalBottomUp.push(
                    allSlots.eq(indexLastChecker + k * 5)
                );
            }
            if (rowLastChecker - k > 0 && indexLastChecker - k * 7 >= 0) {
                slotsInDiagonalTopDown.push(
                    allSlots.eq(indexLastChecker - k * 7)
                );
            }
        }

        // DETERMINES DIAGONAL SLOTS RIGHT OF LAST CHECKER DROPPED AND PUSHES THEM INTO CORRESPONDING ARRAY (BOTTOM-UP OR TOP-DOWN)
        for (var l = 0; l < connect; l++) {
            if (
                rowLastChecker + l <= numRows &&
                indexLastChecker - l * 5 >= 0
            ) {
                slotsInDiagonalBottomUp.push(
                    allSlots.eq(indexLastChecker - l * 5)
                );
            }
            if (
                rowLastChecker + l <= numRows &&
                indexLastChecker + l * 7 <= 41
            ) {
                slotsInDiagonalTopDown.push(
                    allSlots.eq(indexLastChecker + l * 7)
                );
            }
        }

        console.log(slotsInDiagonalBottomUp);

        if (
            checkForVictory(slotsInCol) ||
            checkForVictory(slotsInRow) ||
            checkForVictoryDiagonal(slotsInDiagonalBottomUp) ||
            checkForVictoryDiagonal(slotsInDiagonalTopDown)
        ) {
            // setTimeout(removeClass, 4500);
            // function removeClass() {
            //     victoryMessage.removeClass("hidden");
            // }
            //victoryMessage.html(currPlayer + " wins!");

            //Adds animation class to winning checkers
            for (var m = 0; m < winningCheckers.length; m++) {
                winningCheckers[m].attr("id", "winningChecker");
            }

            //Increases count for winning color after delay of 4.5s (when animation stopped)
            if (currPlayer === "Yellow") {
                winsYellow = winsYellow + 1;
            } else {
                winsRed = winsRed + 1;
            }

            //Removes clich handler (so that player cannot keep adding checkers after win)
            $(".column").off("click");

            // Displays winner message after delay of 4.5s
            setTimeout(displayWins, 4500);
        }

        // Switches player (playing color)
        switchPlayer();
    }

    //FUNCTIONALITIES TO
    //#1 DETERMINE ROW, COLUMN AND DIAGONAL VICTORY,
    //#2 SWITCH PLAYER &
    //#3 BUTTON

    //#1
    function checkForVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currPlayer)) {
                winningCheckers.push(slots.eq(i).children());
                count++;
                console.log(count);
                if (count === 4) {
                    return true;
                }
            } else {
                winningCheckers = [];
                count = 0;
            }
        }
        return false;
    }

    function checkForVictoryDiagonal(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots[i].hasClass(currPlayer)) {
                winningCheckers.push(slots[i].children());
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                winningCheckers = [];
                count = 0;
            }
        }
        return false;
    }

    //#2
    function switchPlayer() {
        if (currPlayer === "Red") {
            currPlayer = "Yellow";
        } else {
            currPlayer = "Red";
        }
    }

    //#3 BUTTON
    $("#resetButton").click(reset);

    function reset() {
        for (var i = 0; i < allSlots.length; i++) {
            allSlots.eq(i).removeClass("Red");
            allSlots.eq(i).removeClass("Yellow");
            allSlots.children().removeAttr("id", "winning");
            // victoryMessage.addClass("hidden");
            // victoryMessage.html("");
        }
        $(".column").on("click", startGame);
    }

    //#4
    function displayWins() {
        $(".textRed").html("Red " + winsRed);
        $(".textYellow").html("Yellow " + winsYellow);
    }
})();
