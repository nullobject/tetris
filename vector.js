/**
 * A `Vector` represents a position and a rotation.
 */
export default class Vector {
	// Returns a new vector with the given rotation.
	static rotate (dir) { if (dir == null) { dir = 1 } return new Vector(0, 0, dir) }

	// Returns a new vector with the given x/y translation.
	static move (x, y) { return new Vector(x, y, 0) }

	// Pre-canned vectors.
	static zero () { return new Vector( 0,  0,  0) }
	static up () { return new Vector( 0, +1,  0) }
	static down () { return new Vector( 0, -1,  0) }
	static left () { return new Vector(-1,  0,  0) }
	static right () { return new Vector(+1,  0,  0) }
	static rotateLeft () { return new Vector( 0,  0, -1) }
	static rotateRight () { return new Vector( 0,  0, +1) }

	constructor (x, y, rotation) {
		this.x = x
		this.y = y
		this.rotation = Math.abs((rotation + 4) % 4)
	}

	add (other) {
		return new Vector(
			this.x + other.x,
			this.y + other.y,
			this.rotation + other.rotation
		)
	}

	clone () { return new Vector(this.x, this.y, this.rotation) }

	// Returns true if this is a rotation, false otherwise.
	isRotate () { return this.rotation !== 0 }

	// Returns true if this is a translations, false otherwise.
	isMove () { return (this.x !== 0) || (this.y !== 0) }

	// Retruns true if this is a wall kick, false otherwise.
	isKick () { return (this.kick != null) && this.kick }

	// Returns true if this is a zero vector.
	isZero () { return (this.x === 0) && (this.y === 0) && (this.rotation === 0) }

	toString () { return `(${this.x}, ${this.y}, ${this.rotation})` }
}
