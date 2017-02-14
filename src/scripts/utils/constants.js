// Arrow keys
export const ARROW_LEFT = 37
export const ARROW_UP = 38
export const ARROW_RIGHT = 39
export const ARROW_DOWN = 40
export const ARROW_KEYS = [ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN]

// Other keys
export const KEY_BACKSPACE = 8
export const KEY_ENTER = 13
export const KEY_ESC = 27
export const KEY_SPACE = 32
export const KEY_ALPHA_A = 65
export const KEY_ALPHA_Z = 90

export const KEYS_A_TO_Z = range(KEY_ALPHA_A, KEY_ALPHA_Z)

export const ALLOWED_KEYS = [
  KEY_BACKSPACE,
  KEY_ENTER,
  KEY_ESC,
  KEY_SPACE
].concat(ARROW_KEYS).concat(KEYS_A_TO_Z)
