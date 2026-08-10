import re

# Domain-specific financial dictionary sentiment analyzer
FINANCIAL_LEXICON = {
    'surge': 2.5, 'soar': 3.0, 'bullish': 2.5, 'outperform': 2.0, 'profit': 2.0,
    'rally': 2.0, 'growth': 1.5, 'gain': 1.5, 'breakout': 2.0, 'upbeat': 1.5,
    'plummet': -3.0, 'slump': -2.5, 'bearish': -2.5, 'underperform': -2.0, 'loss': -2.0,
    'crash': -3.5, 'decline': -1.5, 'drop': -1.5, 'downgrade': -2.0, 'recession': -3.0
}

def analyze_text_sentiment(text):
    words = re.findall(r'\w+', text.lower())
    score = 0.0
    matched = 0
    
    for word in words:
        if word in FINANCIAL_LEXICON:
            score += FINANCIAL_LEXICON[word]
            matched += 1
            
    compound = round(score / max(1, len(words) * 0.5), 2)
    compound = max(-1.0, min(1.0, compound))
    
    if compound >= 0.15:
        label = "BULLISH"
    elif compound <= -0.15:
        label = "BEARISH"
    else:
        label = "NEUTRAL"
        
    return {
        'text': text,
        'compound': compound,
        'label': label,
        'confidence': round(min(100.0, 50.0 + abs(compound) * 50.0), 1)
    }

def analyze_stock_news_sentiment(symbol="RELIANCE"):
    sample_headlines = {
        "RELIANCE": [
            "Reliance Industries reports 14% revenue surge driven by strong retail growth and high margins",
            "Analysts upgrade Reliance stock to Outperform following clean quarterly profit metrics",
            "Refining margins stabilize as green energy investments gain momentum"
        ],
        "TCS": [
            "TCS secures multi-billion dollar enterprise cloud transformation deal in Europe",
            "IT major TCS post upbeat Q3 earnings exceeding consensus margin expectations"
        ],
        "ICICI": [
            "ICICI Bank net profit rises 18% as credit growth remains robust across retail segments"
        ],
        "AAPL": [
            "Apple iPhone sales soar in Asian markets surpassing quarterly revenue targets"
        ],
        "TSLA": [
            "Tesla EV deliveries surge despite broader automotive industry supply chain challenges"
        ]
    }
    
    headlines = sample_headlines.get(symbol.upper(), [
        f"{symbol} market trading sentiment remains steady as volume picks up"
    ])
    
    analyzed = [analyze_text_sentiment(h) for h in headlines]
    avg_compound = round(sum(a['compound'] for a in analyzed) / len(analyzed), 2)
    
    if avg_compound >= 0.15:
        overall_label = "BULLISH"
    elif avg_compound <= -0.15:
        overall_label = "BEARISH"
    else:
        overall_label = "NEUTRAL"
        
    return {
        'symbol': symbol,
        'overall_sentiment': overall_label,
        'avg_compound_score': avg_compound,
        'analyzed_headlines': analyzed
    }
