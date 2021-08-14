class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  console.log(this.queryString)
  }
  

  filtering() {
    let stringToExeclude = ["page", "limit", "sort", "fields"];
    let queryStingsObject = { ...this.queryString };
    stringToExeclude.forEach((element) => delete queryStingsObject[element]);
    let queryStingsObjectIntoString = JSON.stringify(queryStingsObject);
    queryStingsObjectIntoString = queryStingsObjectIntoString.replace(
      /\b(gte|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let backToQueryStringObject = JSON.parse(queryStingsObjectIntoString);

    this.query =  this.query.find(backToQueryStringObject);
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      let sortingCondition = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortingCondition);
    }
    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const fieldCondition = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldCondition);
    }
    return this;
  }
  pagination() {
    if (this.queryString.page && this.queryString.limit) {
      let limitValue = this.queryString.limit * 1 || 10;
      let pageNumber = this.queryString.pageNumber * 1 || 1;
      let skipCondition = (pageNumber - 1) * limitValue;

      this.query = this.query.skip(skipCondition).limit(limitValue);

      return this;
    }
  }
}
module.exports = ApiFeatures;
