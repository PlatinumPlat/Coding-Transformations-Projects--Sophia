class bpmGrapher {
    constructor() {
        this.canvas = document.getElementById("beatsCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.showGrid = true

        this.canvas.width = 800
        this.canvas.height = 600

        this.centerX = 0
        this.centerY = this.canvas.height

        this.initEventListeners()

        this.updateGraph()
    }

    initEventListeners() {
        const inputs = ["y1", "y2", "y3", "y4", "y5", "y6", "y7", "y8", "y9", "y10"]
        inputs.forEach((id) => {
            document.getElementById(id).addEventListener("input", () => {
                this.updateGraph()

            })
        })

        document.getElementById("updateGraph").addEventListener("click", () => {
            this.updateGraph()
        })

        document.getElementById("resetGraph").addEventListener("click", () => {
            this.resetGraph()
        })

        document.getElementById("toggleGrid").addEventListener("click", () => {
            this.toggleGrid()
        })
    }

    getBPMValues() {
        return {
            y1: parseFloat(document.getElementById("y1").value) || 0,
            y2: parseFloat(document.getElementById("y2").value) || 0,
            y3: parseFloat(document.getElementById("y3").value) || 0,
            y4: parseFloat(document.getElementById("y4").value) || 0,
            y5: parseFloat(document.getElementById("y5").value) || 0,
            y6: parseFloat(document.getElementById("y6").value) || 0,
            y7: parseFloat(document.getElementById("y7").value) || 0,
            y8: parseFloat(document.getElementById("y8").value) || 0,
            y9: parseFloat(document.getElementById("y9").value) || 0,
            y10: parseFloat(document.getElementById("y10").value) || 0,
        }
    }

    toCanvasCoords(x, y) {
        return {
            x: this.centerX + 20 * x,
            y: this.centerY - (20 / 8) * y,
        }
    }

    fromCanvasCoords(x, y) {
        return {
            x: x / 20 - this.centerX,
            y: this.centerY - y / 20 * 8,
        }
    }

    drawGrid() {
        if (!this.showGrid) return

        this.ctx.save()
        this.ctx.strokeStyle = "#e2e8f0"
        this.ctx.lineWidth = 1
        this.ctx.setLineDash([2, 2])

        for (let x = 0; x <= this.canvas.width; x += 20) {
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, this.canvas.height)
            this.ctx.stroke()
        }

        for (let y = 0; y <= this.canvas.height; y += 20) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(this.canvas.width, y)
            this.ctx.stroke()
        }

        this.ctx.restore()
    }

    drawAxes() {
        this.ctx.save()
        this.ctx.strokeStyle = "#4a5568"
        this.ctx.lineWidth = 2
        this.ctx.setLineDash([])

        this.ctx.beginPath()
        this.ctx.moveTo(0, this.centerY)
        this.ctx.lineTo(this.canvas.width, this.centerY)
        this.ctx.stroke()

        this.ctx.beginPath()
        this.ctx.moveTo(this.centerX, 0)
        this.ctx.lineTo(this.centerX, this.canvas.height)
        this.ctx.stroke()

        this.ctx.fillStyle = "#4a5568"
        this.ctx.font = "14px Georgia"
        this.ctx.fillText("X", this.canvas.width - 20, this.centerY - 10)
        this.ctx.fillText("Y", this.centerX + 10, 20)
        this.ctx.fillText("(0,0)", this.centerX + 5, this.centerY - 5)

        this.ctx.restore()
    }

    drawGraph(points, color) {
        const canvasPoints = points.map((p) => this.toCanvasCoords(p.x, p.y))

        this.ctx.save()

        for (let i = 0; i < canvasPoints.length - 1; i++) {
            const start = canvasPoints[i];
            const end = canvasPoints[i + 1];

            const colorClass = `min${i + 1}`;
            const tempDiv = document.createElement("div");
            tempDiv.className = `color-box ${colorClass}`;
            document.body.appendChild(tempDiv);
            const color = getComputedStyle(tempDiv).backgroundColor;
            document.body.removeChild(tempDiv);

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        canvasPoints.forEach((point, i) => {
            const colorClass = `min${i + 1}`;
            const tempDiv = document.createElement("div");
            tempDiv.className = `color-box ${colorClass}`;
            document.body.appendChild(tempDiv);
            const color = getComputedStyle(tempDiv).backgroundColor;
            document.body.removeChild(tempDiv);

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            this.ctx.fillStyle = color;
            this.ctx.font = "bold 12px Georgia";
            this.ctx.textAlign = "center";
            this.ctx.fillText(`${points[i].y} BPM`, point.x + 6, point.y - 6);
        });

        this.ctx.restore();
    }

    updateCoordinateDisplays(points) {
        const display = points.map((p, i) => `Minute ${i + 1}: ${p.y} BPM`).join("<br>");
        const element = document.getElementById("original-coordinates");
        if (element) {
            element.innerHTML = display;
        }
    }

    updateGraph() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        if (this.showGrid) this.drawGrid()
        this.drawAxes()

        const bpmRaw = this.getBPMValues()
        const bpmPoints = Object.values(bpmRaw).map((val, i) => ({ x: 4 * i + 2, y: val }))

        this.drawGraph(bpmPoints, "#3182ce")
        this.updateCoordinateDisplays(bpmPoints)
    }

    resetGraph() {
        document.getElementById("y1").value = "100"
        document.getElementById("y2").value = "105"
        document.getElementById("y3").value = "103"
        document.getElementById("y4").value = "95"
        document.getElementById("y5").value = "100"
        document.getElementById("y6").value = "110"
        document.getElementById("y7").value = "101"
        document.getElementById("y8").value = "102"
        document.getElementById("y9").value = "109"
        document.getElementById("y10").value = "115"

        this.updateGraph()
    }

    toggleGrid() {
        this.showGrid = !this.showGrid
        this.updateGraph()

        const button = document.getElementById("toggleGrid")
        button.textContent = this.showGrid ? "Hide Grid" : "Show Grid"
    }

}

document.addEventListener("DOMContentLoaded", () => {
    new bpmGrapher()
})

