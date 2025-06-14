class TriangleTransformer {
    constructor() {
        this.canvas = document.getElementById("triangleCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.showGrid = true

        this.canvas.width = 800
        this.canvas.height = 600

        this.centerX = this.canvas.width / 2
        this.centerY = this.canvas.height / 2

        this.initEventListeners()

        this.updateTriangle()
    }

    initEventListeners() {
        const inputs = ["x1", "y1", "x2", "y2", "x3", "y3"]
        inputs.forEach((id) => {
            document.getElementById(id).addEventListener("input", () => {
                this.updateTriangle()
            })
        })

        document.getElementById("resetTriangle").addEventListener("click", () => {
            this.resetTriangle()
        })

        document.getElementById("toggleGrid").addEventListener("click", () => {
            this.toggleGrid()
        })
    }

    getTriangleCoordinates() {
        return {
            x1: parseFloat(document.getElementById("x1").value) || 0,
            y1: parseFloat(document.getElementById("y1").value) || 0,
            x2: parseFloat(document.getElementById("x2").value) || 0,
            y2: parseFloat(document.getElementById("y2").value) || 0,
            x3: parseFloat(document.getElementById("x3").value) || 0,
            y3: parseFloat(document.getElementById("y3").value) || 0,
        }
    }
    toCanvasCoords(x, y) {
        return {
            x: this.centerX + 20 * x,
            y: this.centerY - 20 * y,
        }
    }

    fromCanvasCoords(x, y) {
        return {
            x: x / 20 - this.centerX,
            y: this.centerY - y / 20,
        }
    }

    reflectAcrossX(x, y) {
        return { x: x, y: -y }
    }

    reflectAcrossY(x, y) {
        return { x: -x, y: y }
    }

    calculateTransformations() {
        const coords = this.getTriangleCoordinates()

        const original = [
            { x: coords.x1, y: coords.y1 },
            { x: coords.x2, y: coords.y2 },
            { x: coords.x3, y: coords.y3 },
        ]

        const xReflection = original.map((point) =>
            this.reflectAcrossX(point.x, point.y),
        )

        const yReflection = xReflection.map((point) =>
            this.reflectAcrossY(point.x, point.y),
        )

        return { original, xReflection, yReflection }
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

    drawTriangle(points, color, label) {
        const canvasPoints = points.map((p) => this.toCanvasCoords(p.x, p.y))

        this.ctx.save()

        this.ctx.fillStyle = color + "40"
        this.ctx.beginPath()
        this.ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y)
        this.ctx.lineTo(canvasPoints[1].x, canvasPoints[1].y)
        this.ctx.lineTo(canvasPoints[2].x, canvasPoints[2].y)
        this.ctx.closePath()
        this.ctx.fill()

        this.ctx.strokeStyle = color
        this.ctx.lineWidth = 2
        this.ctx.stroke()

        this.ctx.fillStyle = color
        canvasPoints.forEach((point, index) => {
            this.ctx.beginPath()
            this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
            this.ctx.fill()

            this.ctx.fillStyle = "#2d3748"
            this.ctx.font = "12px Georgia"
            this.ctx.fillText(
                `(${points[index].x}, ${points[index].y})`,
                point.x + 8,
                point.y - 8,
            )
            this.ctx.fillStyle = color
        })

        const centroidX =
            (canvasPoints[0].x + canvasPoints[1].x + canvasPoints[2].x) / 3
        const centroidY =
            (canvasPoints[0].y + canvasPoints[1].y + canvasPoints[2].y) / 3

        this.ctx.fillStyle = color
        this.ctx.font = "bold 14px Georgia"
        this.ctx.textAlign = "center"
        this.ctx.fillText(label, centroidX, centroidY)
        this.ctx.textAlign = "left"

        this.ctx.restore()
    }

    updateCoordinateDisplays(transformations) {
        const formatCoords = (points) => {
            return points.map((p, i) => `P${i + 1}: (${p.x}, ${p.y})`).join("<br>")
        }

        document.getElementById("originalCoords").innerHTML = formatCoords(
            transformations.original,
        )
        document.getElementById("xReflectionCoords").innerHTML = formatCoords(
            transformations.xReflection,
        )
        document.getElementById("yReflectionCoords").innerHTML = formatCoords(
            transformations.yReflection,
        )
    }

    updateTriangle() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawGrid()
        this.drawAxes()

        const transformations = this.calculateTransformations()

        this.drawTriangle(transformations.original, "#3182ce", "Original")
        this.drawTriangle(transformations.xReflection, "#38a169", "X-Reflection")
        this.drawTriangle(transformations.yReflection, "#d69e2e", "Y-Reflection")

        this.updateCoordinateDisplays(transformations)
    }

    resetTriangle() {
        document.getElementById("x1").value = "3"
        document.getElementById("y1").value = "2"
        document.getElementById("x2").value = "15"
        document.getElementById("y2").value = "2"
        document.getElementById("x3").value = "9"
        document.getElementById("y3").value = "10"

        this.updateTriangle()
    }

    toggleGrid() {
        this.showGrid = !this.showGrid
        this.updateTriangle()

        const button = document.getElementById("toggleGrid")
        button.textContent = this.showGrid ? "Hide Grid" : "Show Grid"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TriangleTransformer()
})

