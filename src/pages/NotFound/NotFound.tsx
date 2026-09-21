import { NOT_FOUND_SEO } from '../../seo/routes';
import { useSeo } from '../../seo/useSeo';

function NotFound() {
  useSeo(NOT_FOUND_SEO);

  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
}

export default NotFound;
