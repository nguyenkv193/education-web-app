import assets from '../assets';

const BlogAvatar = ({ avatar, isVip = false, size = 'md', alt = 'Avatar' }) => {
    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const vipIconSizeMap = {
        sm: 'w-2 h-2  top-0 -right-1.5',
        md: 'w-3 h-3 top-0 -right-2',
    };

    const sizeClass = sizeMap[size] || sizeMap.md;
    const vipIconSize = vipIconSizeMap[size] || vipIconSizeMap.md;

    if (isVip) {
        return (
            <div className={`relative rounded-full ${sizeClass} overflow-visible`}>
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-[#ffd900] to-[#b45264]"></div>
                <div className={`absolute  ${vipIconSize} z-10 rotate-50`}>
                    <img src={assets.vip} alt="VIP" className="w-full h-full" />
                </div>
                <div className="shrink-0 inline-block w-full h-full relative">
                    <div className="absolute inset-[3px] rounded-full overflow-hidden bg-white">
                        <img src={avatar} alt={alt} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative rounded-full ${sizeClass} overflow-hidden bg-white`}>
            <img
                src={avatar || assets.default_avatar}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default BlogAvatar;
