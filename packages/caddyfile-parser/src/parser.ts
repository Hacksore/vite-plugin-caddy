class Block {
  public name: string;
  public properties: any;
  public children: any;

  constructor(name: string, properties: any, children: any) {
    this.name = name; // Name of the block
    this.properties = properties; // Properties of the block (like imports, tls, log, etc.)
    this.children = children; // Nested blocks
  }
}

class Property {
  public name: string;
  public value: string;
  constructor(name: string, value: any) {
    this.name = name; // Name of the property
    this.value = value; // Value of the property
  }
}

export class CaddyfileParser {
  public dsl: any;
  public index: number;

  constructor(dsl: any) {
    console.log("Caddyfile parser");
    this.dsl = dsl;
    this.index = 0;
  }

  parse() {
    console.log(this.dsl);
    const blocks = [];
    while (this.index < this.dsl.length) {
      const block = this.parseBlock();
      if (block) {
        blocks.push(block);
      }
    }
    return blocks;
  }

  parseBlock(): any {
    this.consumeWhitespace();
    if (!this.match("{")) {
      return null;
    }

    const name = this.consumeUntil("{").trim();
    const properties = [];
    const children = [];

    while (this.index < this.dsl.length && !this.match("}")) {
      this.consumeWhitespace();
      const prop = this.parseProperty();
      if (prop) {
        properties.push(prop);
      } else {
        const child = this.parseBlock();
        if (child) {
          children.push(child);
        }
      }
    }

    if (this.match("}")) {
      this.consume("}");
      return new Block(name, properties, children);
    } else {
      throw new Error(`Expected "}" at index ${this.index}`);
    }
  }

  parseProperty() {
    this.consumeWhitespace();
    if (!this.match("@")) {
      return null;
    }

    this.consume("@");

    const name = this.consumeUntil("{").trim();
    const value = this.consumeUntil("}").trim();

    return new Property(name, value);
  }

  consume(expected: any) {
    if (this.dsl[this.index] === expected) {
      this.index++;
    } else {
      throw new Error(`Expected "${expected}" at index ${this.index}`);
    }
  }

  consumeUntil(char: string) {
    let result = "";
    while (this.index < this.dsl.length && this.dsl[this.index] !== char) {
      result += this.dsl[this.index];
      this.index++; // Increment index here
    }
    return result;
  }

  match(char: string) {
    return this.dsl[this.index] === char;
  }

  consumeWhitespace() {
    const char = this.dsl[this.index];
    const isWhitespace = /\s/.test(char);
    while (this.index < this.dsl.length && !isWhitespace) {
      this.index++;
    }
  }
}
