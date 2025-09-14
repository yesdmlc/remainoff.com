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

        const sortedTags = [...tagSet].sort();
        console.log("Tags found:", sortedTags); // 👈 Add this line
        return sortedTags;
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

    eleventyConfig.addFilter("limitWords", function (content, wordLimit = 40) {
        if (!content) return "";
        const words = content.split(/\s+/).slice(0, wordLimit);
        return words.join(" ") + "…";
    });

    eleventyConfig.addFilter("stripHtml", function (content) {
        if (!content) return "";
        return content.replace(/<[^>]*>/g, "");
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