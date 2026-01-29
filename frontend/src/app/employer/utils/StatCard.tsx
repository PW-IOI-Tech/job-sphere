// components/ui/StatCard.tsx
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    period?: string;
  };
  icon?: React.ReactElement<IconProps>;
  className?: string;
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  showInfo?: boolean;
  infoText?: string;
}
interface IconProps {
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  className = '',
  subtitle,
  loading = false,
  onClick,
  variant = 'default',
  showInfo = false,
  infoText
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendBgColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'bg-green-50';
      case 'down':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-4';
      case 'featured':
        return 'p-6 border-l-4 border-blue-500 shadow-md';
      default:
        return 'p-6';
    }
  };

  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val.toString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${getVariantClasses()} ${className} animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border transition-all duration-200 
        ${getVariantClasses()} 
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300 hover:-translate-y-1' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
            {showInfo && infoText && (
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {infoText}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <p className={`font-bold text-gray-900 ${variant === 'featured' ? 'text-3xl' : 'text-2xl'}`}>
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div className={`flex items-center justify-between ${getTrendBgColor()} rounded-md px-2 py-1`}>
              <div className="flex items-center">
                {getTrendIcon()}
                <span className={`ml-1 text-sm font-medium ${getTrendColor()}`}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
              {trend.period && (
                <span className="text-xs text-gray-500">{trend.period}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
    <div className="flex-shrink-0 ml-4">
      <div className={`
        rounded-lg flex items-center justify-center transition-colors duration-200
        ${variant === 'featured' ? 'w-16 h-16 bg-blue-100' : 'w-12 h-12 bg-blue-50'}
        ${onClick ? 'group-hover:bg-blue-200' : ''}
      `}>
        {React.cloneElement(icon as React.ReactElement<IconProps>, {
          className: `${variant === 'featured' ? 'w-8 h-8' : 'w-6 h-6'} ${(icon as React.ReactElement<IconProps>).props.className}`
        })}
      </div>
    </div>
  )}
      </div>
    </div>
  );
};

// Enhanced Stat Card with comparison
interface ComparisonStatCardProps extends Omit<StatCardProps, 'value'> {
  currentValue: number;
  previousValue: number;
  comparisonLabel?: string;
}

export const ComparisonStatCard: React.FC<ComparisonStatCardProps> = ({
  currentValue,
  previousValue,
  icon,
  comparisonLabel = "vs last period",
  ...props
}) => {
  const percentageChange = previousValue === 0 
    ? (currentValue > 0 ? 100 : 0)
    : ((currentValue - previousValue) / previousValue) * 100;

  const trend = {
    value: Math.round(Math.abs(percentageChange)),
    direction: percentageChange > 0 ? 'up' as const : 
               percentageChange < 0 ? 'down' as const : 
               'stable' as const,
    period: comparisonLabel
  };

  return (
    <StatCard
      {...props}
      value={currentValue}
      trend={trend}
      subtitle={`Previous: ${previousValue.toLocaleString()}`}
    />
  );
};

// Metric group component for related stats
interface MetricGroupProps {
  title: string;
  cards: Omit<StatCardProps, 'variant'>[];
  className?: string;
}

export const MetricGroup: React.FC<MetricGroupProps> = ({
  title,
  cards,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            {...card}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
};
