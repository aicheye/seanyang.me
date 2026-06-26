// Single source of truth lives in public/data so the data is also served
// statically over HTTP (e.g. for the SSH TUI at tui.seanyang.me).
import quotes from '../../public/data/quotes.json'

export interface Quote {
  text: string;
  author: string;
}

export default quotes as Quote[]
