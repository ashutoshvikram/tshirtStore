class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }
  search() {
    console.log(this.bigQ);
    const searchWord = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });
    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];
    //Convert the object into String
    let stringOfCopyQ = JSON.stringify(copyQ);
    stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte)\b/g, (m) => `${m}`);

    const jsonOfCopyQ=JSON.parse(stringOfCopyQ)

    this.base=this.base.find(jsonOfCopyQ)
    return this;
  }

  pager(resultsPerPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    const skipVal = resultsPerPage * (currentPage - 1);
    this.base = this.base.limit(resultsPerPage).skip(skipVal);
    return this;
  }
}

module.exports=WhereClause
