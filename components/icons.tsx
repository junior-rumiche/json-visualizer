import React from 'react';

// Using a generic props type for simple SVG icons
type IconProps = React.SVGProps<SVGSVGElement>;

export const PlusSquareIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const MinusSquareIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}
    >
        <path d="M11.25,11.25H7.88A3.38,3.38,0,0,0,4.5,14.63v1.5a3.38,3.38,0,0,0,3.38,3.38h3.37A3.38,3.38,0,0,0,14.63,16.13v-1.5A3.38,3.38,0,0,0,11.25,11.25Z" style={{fill: 'currentColor', opacity: 0.4}}/>
        <path d="M12.75,3.38H9.38A3.38,3.38,0,0,0,6,6.75v1.5a3.38,3.38,0,0,0,3.38,3.38h3.37A3.38,3.38,0,0,0,16.13,8.25v-1.5A3.38,3.38,0,0,0,12.75,3.38Z" style={{fill: 'currentColor'}}/>
        <path d="M16.13,11.63H12.75a3.38,3.38,0,0,0-3.38,3.37v1.5a3.38,3.38,0,0,0,3.38,3.38h3.38A3.38,3.38,0,0,0,19.5,16.5v-1.5A3.38,3.38,0,0,0,16.13,11.63Z" style={{fill: 'currentColor'}}/>
    </svg>
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const PaletteIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.625-6.25a3.75 3.75 0 00-6.25-.625l-6.402 6.401a3.75 3.75 0 000 5.304z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-2.623-1.043-5.043-2.93-6.93a9.75 9.75 0 10-10.563 10.563c1.887 1.887 4.307 2.93 6.93 2.93s5.043-1.043 6.93-2.93c1.887-1.887 2.93-4.307 2.93-6.93z" />
    </svg>
);