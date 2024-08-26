import { Position, Uri } from 'vscode'

export class VirtualDocument extends Map<string, string> {
  static scheme = 'embedded-latex'
  #originalUri?: string
  #uri?: Uri
  position: Position | undefined

  set(key: string, value: string): this {
    if (!this.#originalUri) this.#originalUri = key

    return super.set(key, value)
  }

  get uri() {
    if (this.#uri) return this.#uri

    this.#uri = Uri.parse(`${VirtualDocument.scheme}://latex/${encodeURIComponent(this.#originalUri!)}.tex`)
    return this.#uri
  }
}

