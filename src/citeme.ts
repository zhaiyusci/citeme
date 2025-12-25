import { pickBy, isEqual } from "lodash-es";

let authorsmap = new Map<string, MetaAuthor>([])

function filterJSON(obj: any, defaults: object, keep: string[]) {
  const nonDefaultFields = pickBy(obj, (value: any, key: string) => {
    if (keep.includes(key)) return true;
    if (key in defaults) {
      return !isEqual(value, (defaults as Record<string, any>)[key]);
    }
  });

  return nonDefaultFields;
}

class MetaAuthor {
  first = ""
  von = ""
  last = ""
  jr = ""
  itsme = false

  id = ""

  constructor({ first = "", von = "", last = "", jr = "", id = "", itsme = false }: { first?: string; von?: string; last?: string; jr?: string; id?: string; itsme?: boolean }) {

    Object.assign(this, { first, von, last, jr, itsme })

    if (id == "") {
      id = metaauthorid(this)
    }
    this.id = id
    authorsmap.set(this.id, this)
  }

  toJSON() {
    const defaults = {
      first: "",
      von: "",
      last: "",
      jr: "",
      itsme: false
    };
    return filterJSON(this, defaults, ["id"])
  }
}

function metaauthorid(meta: MetaAuthor): string {
  return `${meta.first}|${meta.von}|${meta.last}|${meta.jr}`
}

class Author {
  meta = ""
  co1st = false
  cocor = false

  constructor({ meta = "", co1st = false, cocor = false }: { meta?: string; first?: string; von?: string; last?: string; jr?: string; co1st?: boolean; cocor?: boolean }) {
    Object.assign(this, { meta, co1st, cocor })
  }

  get first() { return authorsmap.get(this.meta)?.first; }
  get von() { return authorsmap.get(this.meta)?.von; }
  get last() { return authorsmap.get(this.meta)?.last; }
  get jr() { return authorsmap.get(this.meta)?.jr; }
  get itsme() { return authorsmap.get(this.meta)?.itsme; }

  toJSON() {
    const defaults = new Author({});
    return filterJSON(this, defaults, ["meta"])
  }

  toHTML() {
    const words = [this.first, this.von, this.last, this.jr].filter(w => w != "").join(" ");
    return `${this.itsme ? '<b>' : ''}${words}${this.itsme ? '</b>' : ''}`
  }

}


let articles: Article[] = []

class Article {
  authors: Author[]
  title: string
  journal: string
  volume: string
  issue: string
  pages: string
  year: number
  doi: string
  selected: boolean
  constructor(
    {
      authors = [], title = "", journal = "", volume = "", issue = "", pages = "", year = 1935, doi = "", selected = false
    }:
      {
        authors?: Author[]; title?: string; journal?: string; volume?: string; issue?: string; pages?: string; year?: number; doi?: string; selected?: boolean
      }) {
    this.authors = authors
    this.title = title
    this.journal = journal
    this.volume = volume
    this.issue = issue
    this.pages = pages
    this.year = year
    this.doi = doi
    this.selected = selected

    articles.push(this)
  }
  toJSON() {
    const defaults = {
      selected: true,
      doi: "",
      issue: ""
    };
    return filterJSON(this, defaults, [])
  }
  toHTML(enable_marks: Boolean) {
    let authorshtml: string[] = [];
    let numberco1st = this.authors.filter((x) => x.co1st).length
    for (const entry of this.authors) {
      let namehtml = entry.toHTML();
      if (enable_marks) {
        namehtml += `${numberco1st > 1 && entry.co1st ? "#" : ""}${entry.cocor ? "*" : ""}`
      }
      authorshtml.push(namehtml)
    }
    return `${authorshtml.join(", ")};<br/>${this.title};<br/><i>${this.journal}</i> <b>${this.volume}</b>, ${this.pages} (${this.year}); doi:<code>${this.doi}</code>.\n`
  }
}


export function fromJSON(data: string) {
  authorsmap.clear();
  articles.length = 0;

  const records = JSON.parse(data)
  for (const entry of records["authorsmap"]) {
    new MetaAuthor(entry)
  }
  const authorskeys = Array.from(authorsmap.keys())
  for (const entry of records["articles"]) {
    let authors: Author[] = []
    for (const author of entry.authors) {
      const authorobj = new Author(author)
      if (!authorskeys.includes(authorobj.meta)) {
        console.log(authorobj.meta)
      }
      authors.push(authorobj)
    }

    new Article({ ...entry, authors: authors })
  }
}

export function toJSON() {
  return JSON.stringify({ authorsmap: Array.from(authorsmap.values()), articles }, null, 2)
}

export function toHTML(): string {
  let enable_marks = (document.getElementById('enable_marks') as HTMLInputElement).checked;

  let results = "<ul id='citeme'>\n"
  for (const entry of articles) {
    results += `<li>\n${entry.toHTML(enable_marks)}</li>\n`;
  }
  results += "</ul>\n"
  return results
}

