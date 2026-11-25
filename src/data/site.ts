export const site = {
  title: "a_out",
  description: "a_out 的个人主页。",
  url: "https://aout.top",
  author: "a_out",
  email: "",
  github: "https://github.com/aout1145",
  startYear: 2026,
  nav: [
    { label: "首页", url: "/" },
    { label: "归档", url: "/archive.html" },
  ],
};

export type NavItem = (typeof site.nav)[number];
