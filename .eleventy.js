const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Passthroughs
  eleventyConfig.addPassthroughCopy("src/images/uploads");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Collections
  eleventyConfig.addCollection("entries", function (collectionApi) {
    const entries = collectionApi.getFilteredByGlob("src/entries/*.md");
    if (process.env.NODE_ENV !== "production") {
      console.log("Entries found:", entries.map(e => e.inputPath));
    }
    return entries;
  });

  // Filters
  eleventyConfig.addFilter("date", (dateObj, format = "MMMM d, yyyy") => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj).toFormat("MMMM d, yyyy");
  });

  // Global data
  eleventyConfig.addGlobalData("now", () => new Date());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};