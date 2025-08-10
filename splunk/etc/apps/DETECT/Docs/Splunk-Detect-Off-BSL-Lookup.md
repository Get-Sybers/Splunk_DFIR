# Splunk Lookup Filtering Methods for Non-Matches

## Method 1: Using lookup and filtering for non-matches (Recommended)

```splunk
index=your_index sourcetype=your_sourcetype
| lookup baseline_lookup.csv "process name" processport OUTPUT baselined
| where isnull(baselined)
```

**Best for:** Most scenarios due to simplicity and performance

## Method 2: Using subsearch with NOT IN for both fields

```splunk
index=your_index sourcetype=your_sourcetype
| eval process_port_combo = 'process name' + ":" + processport
| where NOT process_port_combo IN [
    | inputlookup baseline_lookup.csv 
    | eval process_port_combo = 'process name' + ":" + processport
    | return 1000 process_port_combo
]
```

**Best for:** Complex scenarios where you need to combine multiple fields for comparison

## Method 3: Multiple field lookup check

```splunk
index=your_index sourcetype=your_sourcetype
| lookup baseline_lookup.csv "process name" processport OUTPUT baselined as is_baselined
| where isnull(is_baselined)
| fields - is_baselined
```

**Best for:** When you want to rename the output field for clarity and clean up the results

## Method 4: More explicit approach with join

```splunk
index=your_index sourcetype=your_sourcetype
| join type=left "process name" processport [
    | inputlookup baseline_lookup.csv 
    | fields "process name" processport baselined
]
| where isnull(baselined)
| fields - baselined
```

**Best for:** When you need more control over the join operation or when working with complex lookup relationships

## Method 5: If you want to see what's NOT baselined vs what is

```splunk
index=your_index sourcetype=your_sourcetype
| lookup baseline_lookup.csv "process name" processport OUTPUT baselined
| eval status = if(isnull(baselined), "NOT_BASELINED", "BASELINED")
| where status="NOT_BASELINED"
```

**Best for:** When you want to explicitly categorize and potentially analyze both baselined and non-baselined results

## Most Recommended for Performance

```splunk
index=your_index sourcetype=your_sourcetype
| lookup baseline_lookup.csv "process name" processport OUTPUT baselined
| where isnull(baselined)
```

**Why this is recommended:**
- Simple and clean syntax
- Optimal performance
- Easy to understand and maintain
- Minimal resource usage
- Direct filtering approach