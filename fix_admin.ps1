$file = 'app\admin\page.tsx'
$content = Get-Content $file -Raw

# Fix broken modal sections: convert standalone { expr && ( ... ) } to {expr && ( ... )}
# Pattern: ) followed by newline+spaces+} followed by blank line and {/* Comment */ }
# Replace with proper )}

# Fix User Detail Modal header
$content = $content -replace '(?ms)\{/\* User Detail Modal \*/ \}\r?\n    \{\r?\n        selectedUser && \(', '{/* User Detail Modal */}' + [System.Environment]::NewLine + '                {selectedUser && ('

# Fix Group Detail Modal header  
$content = $content -replace '(?ms)\r?\n        \)\r?\n    \}\r?\n\r?\n    \{/\* Group Detail Modal \*/ \}\r?\n    \{\r?\n        selectedGroup && \(', ')}`r`n`r`n                {/* Group Detail Modal */}`r`n                {selectedGroup && ("

# Fix Delete Confirmation Modal header
$content = $content -replace '(?ms)\r?\n        \)\r?\n    \}\r?\n\r?\n    \{/\* Delete Confirmation Modal \*/ \}\r?\n    \{\r?\n        postToDelete && \(', ')}`r`n`r`n                {/* Delete Confirmation Modal */}`r`n                {postToDelete && ("

# Fix closing ) } of last modal and </main > </div >
$content = $content -replace '        \)\r?\n    \}\r?\n            </main >', '                )}`r`n            </main>'
$content = $content -replace '</div >', '</div>'

Set-Content $file $content -NoNewline -Encoding UTF8
Write-Host "Done"
