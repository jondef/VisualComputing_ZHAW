/*
    Bresenham algorihm: drawing line, circle, ellipse; and dda line rasterization

    Wojciech Mu≥a; 4.02.2007
    Extended by Philipp Ackermann; 2014 with DDA and AA
    public domain
*/


function draw_line(ctx, x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;

    var inc_x = (dx >= 0) ? +1 : -1;
    var inc_y = (dy >= 0) ? +1 : -1;

    dx = (dx < 0) ? -dx : dx;
    dy = (dy < 0) ? -dy : dy;

    if (dx >= dy) {
        var d = 2 * dy - dx
        var delta_A = 2 * dy
        var delta_B = 2 * dy - 2 * dx

        var x = 0;
        var y = 0;
        for (i = 0; i <= dx; i++) {
            put_pixel(ctx, x + x0, y + y0, "black");
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            } else {
                d += delta_A;
                x += inc_x;
            }
        }
    } else {
        var d = 2 * dx - dy
        var delta_A = 2 * dx
        var delta_B = 2 * dx - 2 * dy

        var x = 0;
        var y = 0;
        for (i = 0; i <= dy; i++) {
            put_pixel(ctx, x + x0, y + y0, "black");
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            } else {
                d += delta_A;
                y += inc_y;
            }
        }
    }
}


function ellipse_points(ctx, x0, y0, x, y, color) {
    put_pixel(ctx, x0 + x, y0 + y, color);
    put_pixel(ctx, x0 - x, y0 + y, color);
    put_pixel(ctx, x0 + x, y0 - y, color);
    put_pixel(ctx, x0 - x, y0 - y, color);
}


function draw_circle(ctx, x0, y0, r) {
    var d = 5 - 4 * r;

    var x = 0;
    var y = r;

    var deltaA = (-2 * r + 5) * 4;
    var deltaB = 3 * 4;

    while (x <= y) {
        ellipse_points(ctx, x0, y0, x, y, "black");
        ellipse_points(ctx, x0, y0, y, x, "black");

        if (d > 0) {
            d += deltaA;

            y -= 1;
            x += 1

            deltaA += 4 * 4;
            deltaB += 2 * 2;
        } else {
            d += deltaB;

            x += 1;

            deltaA += 2 * 4;
            deltaB += 2 * 4;
        }
    }
}


function rasterize(ctx, x0, y0, a, b, hw, color) {
    var a2 = a * a;
    var b2 = b * b;

    var d = 4 * b2 - 4 * b * a2 + a2;
    var delta_A = 4 * 3 * b2;
    var delta_B = 4 * (3 * b2 - 2 * b * a2 + 2 * a2);

    var limit = (a2 * a2) / (a2 + b2);

    var x = 0;
    var y = b;
    while (true) {
        if (hw)
            ellipse_points(ctx, x0, y0, x, y, color);
        else
            ellipse_points(ctx, x0, y0, y, x, color);

        if (x * x >= limit)
            break;

        if (d > 0) {
            d += delta_B;
            delta_A += 4 * 2 * b2;
            delta_B += 4 * (2 * b2 + 2 * a2);

            x += 1;
            y -= 1;
        } else {
            d += delta_A;
            delta_A += 4 * 2 * b2;
            delta_B += 4 * 2 * b2;

            x += 1;
        }
    }
}


function draw_ellipse(ctx, x0, y0, a, b) {
    rasterize(ctx, x0, y0, a, b, true, "red");
    rasterize(ctx, x0, y0, b, a, false, "blue");
}


// DDA line rasterization
function draw_dda_line(ctx, x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;

    var inc_y = dy / dx;

    for (i = 0; i <= dx; i++) {
        put_pixel(ctx, x0 + i, y0 + Math.round(i * inc_y), "black");
    }
}

// Antialiased line rasterization
function draw_aaa_line(ctx, x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var err = dx - dy;

    var inc_x = (dx >= 0) ? +1 : -1;
    var inc_y = (dy >= 0) ? +1 : -1;

    dx = (dx < 0) ? -dx : dx;
    dy = (dy < 0) ? -dy : dy;

    var grey;

    if (dx >= dy) {
        var d = 2 * dy - dx
        var delta_A = 2 * dy
        var delta_B = 2 * dy - 2 * dx
        var err = dx - dy;
        var invD = 1.0 / Math.sqrt(dx * dx + dy * dy); /* Precomputed inverse denominator */
        console.log((err - dx + dy));
        var x = 0;
        var y = 0;
        for (i = 0; i <= dx; i++) {
            grey = 255 * Math.abs(err - dx + dy) * invD;
            put_pixel(ctx, x + x0, y + y0, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            } else {
                d += delta_A;
                x += inc_x;
            }
            err += dx;
        }
    } else {
        var d = 2 * dx - dy
        var delta_A = 2 * dx
        var delta_B = 2 * dx - 2 * dy

        var x = 0;
        var y = 0;
        for (i = 0; i <= dy; i++) {
            put_pixel(ctx, x + x0, y + y0, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            } else {
                d += delta_A;
                y += inc_y;
            }
        }
    }
}

// Xiaolin Wu's line algorithm (anti-aliased)

function ipart(x) {
    return Math.floor(x);
}

function roundf(x) {
    return ipart(x + 0.5);
}

function fpart(x) {
    return x - ipart(x);
}

function rfpart(x) {
    return 1.0 - fpart(x);
}

function draw_aa_line(ctx, x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var grey;
    var steep = false;
    
    if (Math.abs(dx) < Math.abs(dy)) {
        steep = true;
        tmp = x1;
        x1 = y1;
        y1 = tmp;
        tmp = x2;
        x2 = y2;
        y2 = tmp;
    }
    
    if (x1 > x2) {
        tmp = x1;
        x1 = x2;
        x2 = tmp;
        tmp = y1;
        y1 = y2;
        y2 = tmp;
    }
    
    dx = x2 - x1;
    dy = y2 - y1;
    gradient = dy / dx;

    // handle first endpoint
    xend = roundf(x1);
    yend = y1 + gradient * (xend - x1);
    xgap = rfpart(x1 + 0.5);
    xpxl1 = xend; 
    ypxl1 = ipart(yend);
    if (steep) {
        grey = Math.floor(255 * (1.0 - rfpart(yend) * xgap));
        put_pixel(ctx, ypxl1, xpxl1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        grey = Math.floor(255 * (1.0 - fpart(yend) * xgap));
        put_pixel(ctx, ypxl1 + 1, xpxl1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
    } else {
        grey = Math.floor(255 * (1.0 - rfpart(yend) * xgap));
        put_pixel(ctx, xpxl1, ypxl1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        grey = Math.floor(255 * (1.0 - fpart(yend) * xgap));
        put_pixel(ctx, xpxl1, ypxl1 + 1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
    }
    intery = yend + gradient; // first y-intersection for the main loop

    // handle second endpoint
    xend = roundf(x2);
    yend = y2 + gradient * (xend - x2);
    xgap = fpart(x2 + 0.5);
    xpxl2 = xend; 
    ypxl2 = ipart(yend);
    if (steep) {
        grey = Math.floor(255 * (1.0 - rfpart(yend) * xgap));
        put_pixel(ctx, ypxl2, xpxl2, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        grey = Math.floor(255 * (1.0 - fpart(yend) * xgap));
        put_pixel(ctx, ypxl2 + 1, xpxl2, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
    } else {
        grey = Math.floor(255 * (1.0 - rfpart(yend) * xgap));
        put_pixel(ctx, xpxl2, ypxl2, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        grey = Math.floor(255 * (1.0 - fpart(yend) * xgap));
        put_pixel(ctx, xpxl2, ypxl2 + 1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
    }

    // main drawing loop
    for (x = xpxl1 + 1; x < xpxl2; x++) {
        if (steep) {
            grey = Math.floor(255 * (1.0 - rfpart(intery)));
            put_pixel(ctx, ipart(intery), x, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
            grey = Math.floor(255 * (1.0 - fpart(intery)));
            put_pixel(ctx, ipart(intery) + 1, x, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        } else {
            grey = Math.floor(255 * (1.0 - rfpart(intery)));
            put_pixel(ctx, x, ipart(intery), 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
            grey = Math.floor(255 * (1.0 - fpart(intery)));
            put_pixel(ctx, x, ipart(intery) + 1, 'rgb(' + grey + ', ' + grey + ', ' + grey + ')');
        }
        intery = intery + gradient;
    }
}

// eof