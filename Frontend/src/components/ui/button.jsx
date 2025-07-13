import * as React from "react";

const Button = React.forwardRef(function Button(props, ref) {
  return <button ref={ref} {...props} />;
});

export { Button };
export default Button;
