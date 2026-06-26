// Single source of truth lives in public/data so the data is also served
// statically over HTTP (e.g. for the SSH TUI at tui.seanyang.me).
import adjectives from '../../public/data/adjectives.json'

export default adjectives as string[]
