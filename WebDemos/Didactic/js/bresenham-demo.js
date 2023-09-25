/*
	Bresenham demo

	Wojciech Mu≥a
	4.02.2007
	public domain
*/

/////////////////////////////////////////////////////////////////////
// settings

var pixel_size = 8;
var ps = pixel_size;
var x_size = 400;
var y_size = 400;


function draw_grid(ctx) {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, x_size, y_size);

    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    for (x = 0; x < x_size; x += pixel_size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y_size);
    }
    for (y = 0; y < y_size; y += pixel_size) {
        ctx.moveTo(0, y);
        ctx.lineTo(x_size, y);
    }
    ctx.stroke();
    ctx.restore();
}

function put_pixel(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);
    ctx.restore();
}


/////////////////////////////////////////////////////////////////////
// line drawing

var line_x0 = 1;
var line_y0 = 1;
var line_x1 = 18;
var line_y1 = 4;

function update_line_view() {
    draw_grid(ctx);
    draw_line(ctx, line_x0, line_y0, line_x1, line_y1);

    ctx.strokeStyle = "#0fa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(line_x0 * ps + ps / 2.0, line_y0 * ps + ps / 2.0);
    ctx.lineTo(line_x1 * ps + ps / 2.0, line_y1 * ps + ps / 2.0);
    ctx.stroke();
}

var lx = -1;
var ly = -1;

function line_edit(e) {
    var px = Math.floor((e.pageX - 11) / pixel_size);
    var py = Math.floor((e.pageY - 11) / pixel_size);
    if (px == lx && py == ly) return;

    var d0 = (line_x0 - px) * (line_x0 - px) + (line_y0 - py) * (line_y0 - py);
    var d1 = (line_x1 - px) * (line_x1 - px) + (line_y1 - py) * (line_y1 - py);
    if (d0 < d1) {
        line_x0 = px;
        line_y0 = py;
    } else {
        line_x1 = px;
        line_y1 = py;
    }
    lx = px;
    ly = py;

    update_line_view();
}


/////////////////////////////////////////////////////////////////////
// circle drawing

var circle_x = Math.floor(0.5 * x_size / pixel_size + 0.5) - 1;
var circle_y = Math.floor(0.5 * y_size / pixel_size + 0.5) - 1;
var circle_r = 4;

function update_circle_view() {
    draw_grid(ctx);
    draw_circle(ctx, circle_x, circle_y, circle_r);

    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circle_x * ps + ps / 2.0, circle_y * ps + ps / 2.0, circle_r * ps, 0, Math.PI * 2, true);
    ctx.stroke();
}

var cx = -1;
var cy = -1;

function circle_edit(e) {
    var px = Math.floor((e.pageX - 11) / pixel_size);
    var py = Math.floor((e.pageY - 11) / pixel_size);
    if (px == cx && py == cy) return;

    var dx = circle_x - px;
    var dy = circle_y - py;
    circle_r = Math.round(Math.sqrt(dx * dx + dy * dy));
    cx = px;
    cy = py;

    update_circle_view();
}


/////////////////////////////////////////////////////////////////////
// ellipse drawing

var ellipse_x = Math.floor(0.5 * x_size / pixel_size + 0.5) - 1;
var ellipse_y = Math.floor(0.5 * y_size / pixel_size + 0.5) - 1;
var ellipse_a = 7;
var ellipse_b = 12;

function update_ellipse_view() {
    draw_grid(ctx);
    draw_ellipse(ctx, ellipse_x, ellipse_y, ellipse_a, ellipse_b);
}

var ex = -1;
var ey = -1;

function ellipse_edit(e) {
    var px = Math.floor((e.pageX - 11) / pixel_size);
    var py = Math.floor((e.pageY - 11) / pixel_size);
    if (px == ex && py == ey) return;

    var dx = circle_x - px;
    var dy = circle_y - py;
    ellipse_a = Math.round(Math.abs(dx));
    ellipse_b = Math.round(Math.abs(dy));
    ex = px;
    ey = py;

    update_ellipse_view();
}

/////////////////////////////////////////////////////////////////////
// dda line drawing

function update_dda_line_view() {
    draw_grid(ctx);
    draw_dda_line(ctx, line_x0, line_y0, line_x1, line_y1);

    ctx.strokeStyle = "#f50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(line_x0 * ps + ps / 2.0, line_y0 * ps + ps / 2.0);
    ctx.lineTo(line_x1 * ps + ps / 2.0, line_y1 * ps + ps / 2.0);
    ctx.stroke();
}

function dda_line_edit(e) {
    var px = Math.floor((e.pageX - 11) / pixel_size);
    var py = Math.floor((e.pageY - 11) / pixel_size);
    if (px == lx && py == ly) return;

    var d0 = (line_x0 - px) * (line_x0 - px) + (line_y0 - py) * (line_y0 - py);
    var d1 = (line_x1 - px) * (line_x1 - px) + (line_y1 - py) * (line_y1 - py);
    if (d0 < d1) {
        line_x0 = px;
        line_y0 = py;
    } else {
        line_x1 = px;
        line_y1 = py;
    }
    lx = px;
    ly = py;

    update_dda_line_view();
}


/////////////////////////////////////////////////////////////////////
// antialiased line drawing

function update_aa_line_view() {
    draw_grid(ctx);
    draw_aa_line(ctx, line_x0, line_y0, line_x1, line_y1);

    ctx.strokeStyle = "#0a0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(line_x0 * ps + ps / 2.0, line_y0 * ps + ps / 2.0);
    ctx.lineTo(line_x1 * ps + ps / 2.0, line_y1 * ps + ps / 2.0);
    ctx.stroke();
}

function aa_line_edit(e) {
    var px = Math.floor((e.pageX - 11) / pixel_size);
    var py = Math.floor((e.pageY - 11) / pixel_size);
    if (px == lx && py == ly) return;

    var d0 = (line_x0 - px) * (line_x0 - px) + (line_y0 - py) * (line_y0 - py);
    var d1 = (line_x1 - px) * (line_x1 - px) + (line_y1 - py) * (line_y1 - py);
    if (d0 < d1) {
        line_x0 = px;
        line_y0 = py;
    } else {
        line_x1 = px;
        line_y1 = py;
    }
    lx = px;
    ly = py;

    update_aa_line_view();
}


// eof