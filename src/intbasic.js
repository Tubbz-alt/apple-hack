const LETTERS =
  '                                ' +
  ' !"#$%&\'()*+,-./0123456789:;<=>?' +
  '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_' +
  '`abcdefghijklmnopqrstuvwxyz{|}~ '

const TOKENS = {
  0x02: '_',
  0x03: ':',
  0x04: 'LOAD',
  0x05: 'SAVE',
  0x06: 'CON',
  0x07: 'RUN',
  0x08: 'RUN',
  0x09: 'DEL',
  0x0A: ',',
  0x0B: 'NEW',
  0x0C: 'CLR',
  0x0D: 'AUTO',
  0x0E: ',',
  0x0F: 'MAN',
  0x10: 'HIMEM:',
  0x11: 'LOMEM:',
  0x12: '+',
  0x13: '-',
  0x14: '*',
  0x15: '/',
  0x16: '=',
  0x17: '#',
  0x18: '>=',
  0x19: '>',
  0x1A: '<=',
  0x1B: '<>',
  0x1C: '<',
  0x1D: 'AND',
  0x1E: 'OR',
  0x1F: 'MOD',
  0x20: '^',
  0x21: '+',
  0x22: '(',
  0x23: ',',
  0x24: 'THEN',
  0x25: 'THEN',
  0x26: ',',
  0x27: ',',
  0x28: '\'',
  0x29: '\'',
  0x2A: '(',
  0x2B: '!',
  0x2C: '!',
  0x2D: '(',
  0x2E: 'PEEK',
  0x2F: 'RND',
  0x30: 'SGN',
  0x31: 'ABS',
  0x32: 'PDL',
  0x33: 'RNDX',
  0x34: '(',
  0x35: '+',
  0x36: '-',
  0x37: 'NOT',
  0x38: '(',
  0x39: '=',
  0x3A: '#',
  0x3B: 'LEN(',
  0x3C: 'ASC(',
  0x3D: 'SCRN(',
  0x3E: ',',
  0x3F: '(',
  0x40: '$',
  0x41: '$',
  0x42: '(',
  0x43: ',',
  0x44: ',',
  0x45: ';',
  0x46: ';',
  0x47: ';',
  0x48: ',',
  0x49: ',',
  0x4A: ',',
  0x4B: 'TEXT',
  0x4C: 'GR',
  0x4D: 'CALL',
  0x4E: 'DIM',
  0x4F: 'DIM',
  0x50: 'TAB',
  0x51: 'END',
  0x52: 'INPUT',
  0x53: 'INPUT',
  0x54: 'INPUT',
  0x55: 'FOR',
  0x56: '=',
  0x57: 'TO',
  0x58: 'STEP',
  0x59: 'NEXT',
  0x5A: ',',
  0x5B: 'RETURN',
  0x5C: 'GOSUB',
  0x5D: 'REM',
  0x5E: 'LET',
  0x5F: 'GOTO',
  0x60: 'IF',
  0x61: 'PRINT',
  0x62: 'PRINT',
  0x63: 'PRINT',
  0x64: 'POKE',
  0x65: ',',
  0x66: 'COLOR=',
  0x67: 'PLOT',
  0x68: ',',
  0x69: 'HLIN',
  0x6A: ',',
  0x6B: 'AT',
  0x6C: 'VLIN',
  0x6E: 'AT',
  0x6F: 'VTAB',
  0x70: '=',
  0x71: '=',
  0x72: ')',
  0x73: ')',
  0x74: 'LIST',
  0x76: 'LIST',
  0x77: 'POP',
  0x78: 'NODSP',
  0x79: 'NODSP',
  0x7A: 'NOTRACE',
  0x7B: 'DSP',
  0x7C: 'DSP',
  0x7D: 'TRACE',
  0x7E: 'PR#',
  0x7F: 'IN#'
}

class IntBasicDump {
  constructor (data) {
    this.data = data
  }

  toString () {
    const readByte = (addr) => {
      return this.data.data[addr]
    }

    const readWord = (addr) => {
      const lsb = readByte(addr)
      const msb = readByte(addr + 1)

      return (msb << 8) | lsb
    }

    var str = ''
    var addr = 0
    var himem = this.data.length
    do {
      var lineno = readWord(addr)
      addr += 2

      str += lineno
      str += ' '
      var val = 0
      do {
        val = readByte(addr++)
        if (val >= 0xB0 && val <= 0xB9) {
          str += readWord(addr)
          addr += 2
        } else if (val < 0x80 && val > 0x01) {
          var t = TOKENS[val]
          if (t.length > 1) { str += ' ' }
          str += t
          if (t.length > 1) { str += ' ' }
        } else if (val > 0x80) { str += LETTERS[val - 0x80] }
        console.log(addr, himem, str)
      } while (val !== 0x01)
      str += '\n'
      console.log(addr, himem, str)
    } while (addr < himem)

    return str
  }
}

module.exports = IntBasicDump
