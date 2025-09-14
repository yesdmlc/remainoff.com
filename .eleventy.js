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

  eleventyConfig.addCollection("allTags", function (collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/entries/*.md").forEach(item => {
      if ("tags" in item.data) {
        let tags = Array.isArray(item.data.tags) ? item.data.tags : [item.data.tags];
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet].sort();
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

  eleventyConfig.addFilter("filterByTag", function (entries, tag) {
    return entries.filter(entry => {
      const tags = entry.data.tags || [];
      return tags.includes(tag);
    });
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