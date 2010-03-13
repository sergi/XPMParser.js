/*
* Copyright (c) 2010 Sergi Mansilla. All rights reserved.
* http://www.sergimansilla.com/
*/

var XPMParser = function() {
}

XPMParser.hex2rgb = function(color) {
    if (color.substring(0, 1) == "#")
        color = color.substring(1, color.length);

    return [parseInt(color.substring(0, 2), 16),
            parseInt(color.substring(2, 4), 16),
            parseInt(color.substring(4, 6), 16),
            255];
}

XPMParser.prototype = {
    read: function(xpm) {
        var xpm = xpm.replace(/\/\*[\s\S]*?\*\//, ""), // Strip multicomments
            data = xpm.substring(xpm.indexOf("\""), xpm.length-1)
                      .replace(/"/g, "").split(","),
            values = data[0].split(/\s/).map(function(v) { return parseInt(v) }),
            numColors = values[2],
            charsColor = values[3],
            cIndex = [], colors = [];

        for (var c = 0; c < numColors; c++) {
            var d = data[c+1].match(/(.+)\s.+\s(.+)$/);
            cIndex[c] = d[1];
            colors[c] = d[2];
        }

        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            imgd = ctx.createImageData(values[0], values[1]),
            pixels = imgd.data;

        canvas.setAttribute("width", values[0]);
        canvas.setAttribute("height", values[1]);

        for (var i = numColors+1, image=[]; i <= data.length-1; i++)
            image.push(data[i].replace("\n", ""));

        for (var r = 0, counter = 0; r<image.length; r++) {
            row = image[r];
            for (var c = 0; c<row.length; c+=charsColor) {
                var code = row.substring(c, c+charsColor),
                    color = colors[cIndex.indexOf(code)] || "None",
                    rgbColor = color == "None" ? [0,0,0,0] : XPMParser.hex2rgb(color);

                for (var i=0; i<4; i++) pixels[counter+i] = rgbColor[i];
                counter += 4;
            }
        }
        ctx.putImageData(imgd, 0,0);
        return canvas;
    }
}


