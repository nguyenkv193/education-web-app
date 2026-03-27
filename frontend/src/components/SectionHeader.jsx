import { Link } from 'react-router-dom';

export default function SectionHeader({ title, badge, actionText, actionHref, low, extra }) {
    return (
        <div className="flex items-center justify-between">
            <h2 className={`${low ? 'text-xl' : extra ? 'text-3xl' : 'text-2xl'} font-extrabold`}>
                {title}{' '}
                {badge ? (
                    <sup className="inline-block align-middle text-xs bg-[#1473e6] text-white px-2 py-0.5 rounded uppercase">
                        {badge}
                    </sup>
                ) : null}
            </h2>
            {actionText ? (
                <Link
                    to={actionHref || '#'}
                    className="text-[#f05123] text-sm flex items-center gap-1 group"
                >
                    <span className="group-hover:underline underline-offset-2 font-semibold">
                        {actionText}
                    </span>
                    <svg
                        viewBox="0 0 320 512"
                        aria-hidden="true"
                        className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-500"
                    >
                        <path
                            fill="currentColor"
                            d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        />
                    </svg>
                </Link>
            ) : null}
        </div>
    );
}
