import Link from 'next/link';
import { BreadcrumbSeparator } from './ui/breadcrumb';

type BreadcrumbItem = {
    label: string;
    href?: string; // href is optional for the current breadcrumb
};

type BreadcrumbProps = {
    breadcrumbs: BreadcrumbItem[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex space-x-1 text-sm">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                        {breadcrumb.href ? (
                            <Link legacyBehavior href={breadcrumb.href}>
                                <a className="capitalize">{breadcrumb.label}</a>
                            </Link>
                        ) : (
                             <span className="capitalize">{breadcrumb.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <span className="mx-4"><BreadcrumbSeparator/></span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;