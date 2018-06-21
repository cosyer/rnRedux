import login from "./login";
import list from "./list";
import detail from "./detail";

export default {
  ...login,
  ...list,
  ...detail
};

// const result={  ...login,...list,...detail }
// export default result
